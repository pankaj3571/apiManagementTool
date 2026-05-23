import { User, UserDocument } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { IAdmin } from '../interfaces/admin.interface';
import { toIAdmin } from '../mappers/admin.mapper';
export class UserService {
  async login(email: string, password: string): Promise<IAdmin> {
    try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await (user as unknown as UserDocument).comparePassword(password);
    console.log('isPasswordValid', isPasswordValid);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
    (user as unknown as UserDocument).tokens!.accessToken = token;
      (user as unknown as UserDocument).lastLogin = new Date();
      await user.save();
      return toIAdmin(user as unknown as UserDocument);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
}