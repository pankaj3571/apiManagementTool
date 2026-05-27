import { Types } from 'mongoose';
import { IAuthUser, LoginResult } from '../interfaces/auth.interface';
import { toIAuthUser } from '../mappers/user.mapper';
import { User, UserDocument } from '../models/user.model';
import { AuthRole } from '../interfaces/auth.interface';
import { AuthTokens, SignTokenInput, signAuthTokens, verifyRefreshToken } from '../utils/token.util';

export class AuthService {
  async login(email: string, password: string): Promise<LoginResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      throw new Error('User not found');
    }

    const doc = user as unknown as UserDocument;
    const isPasswordValid = await doc.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    if (!this.isAccountActive(doc)) {
      throw new Error('Account is not active');
    }

    return this.issueTokens(doc);
  }

  async refresh(refreshToken: string): Promise<LoginResult> {
    const payload = verifyRefreshToken(refreshToken);

    if (!Types.ObjectId.isValid(payload.userId)) {
      throw new Error('Invalid refresh token');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const doc = user as unknown as UserDocument;
    if (doc.role !== payload.role) {
      throw new Error('Invalid refresh token');
    }

    if (doc.tokens?.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    if (!this.isAccountActive(doc)) {
      throw new Error('Account is not active');
    }

    return this.issueTokens(doc);
  }

  private isAccountActive(user: UserDocument): boolean {
    if (user.status !== 'active') {
      return false;
    }
    if (user.role === 'admin' && (!user.isActive || user.isBlocked || user.isDeleted)) {
      return false;
    }
    return true;
  }

  private async issueTokens(user: UserDocument): Promise<LoginResult> {
    const role = user.role as AuthRole;
    const tokenInput: SignTokenInput = {
      userId: user._id,
      role,
    };

    if (role === 'client' || role === 'user') {
      if (!user.clientId) {
        throw new Error('Client account is misconfigured');
      }
      tokenInput.clientId = user.clientId.toString();
    }

    const tokens = signAuthTokens(tokenInput);
    user.tokens = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
    user.lastLogin = new Date();
    await user.save();

    return {
      user: toIAuthUser(user),
      tokens,
    };
  }
}
