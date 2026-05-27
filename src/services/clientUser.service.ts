import { Types } from 'mongoose';
import { IClientUser, ICreateClientUser, IUpdateClientUser } from '../interfaces/clientUser.interface';
import { toIClientUser } from '../mappers/user.mapper';
import { Client } from '../models/client.model';
import { User, UserDocument } from '../models/user.model';

export class ClientUserService {
  async listByClient(clientId: string): Promise<IClientUser[]> {
    if (!Types.ObjectId.isValid(clientId)) {
      throw new Error('Invalid client id');
    }

    const client = await Client.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const users = await User.find({ role: 'user', clientId })
      .select('-password')
      .sort({ createdAt: -1 });

    return users.map((u) => toIClientUser(u as unknown as UserDocument));
  }

  async createClientUser(input: ICreateClientUser): Promise<IClientUser> {
    if (!input?.name?.trim() || !input?.email?.trim() || !input?.password || !input?.clientId) {
      throw new Error('Name, email, password, and client are required');
    }

    if (!Types.ObjectId.isValid(input.clientId)) {
      throw new Error('Invalid client id');
    }

    const client = await Client.findById(input.clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    try {
      const memberRole = input.role === 'client' ? 'client' : 'user';
      const permissions =
        memberRole === 'client'
          ? { canCreateApis: true, canCreateProjects: true }
          : {
              canCreateApis: input.permissions?.canCreateApis ?? false,
              canCreateProjects: input.permissions?.canCreateProjects ?? false,
            };

      const newUser = await User.create({
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
        role: memberRole,
        clientId: input.clientId,
        permissions,
        status: input.status ?? 'active',
      });

      const saved = await User.findById(newUser._id).select('-password');
      return toIClientUser(saved as unknown as UserDocument);
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        throw new Error('A user with this email already exists');
      }
      throw error;
    }
  }

  async updateClientUser(
    clientId: string,
    userId: string,
    input: IUpdateClientUser
  ): Promise<IClientUser> {
    if (!Types.ObjectId.isValid(clientId) || !Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid id');
    }

    const user = await User.findOne({ _id: userId, clientId, role: 'user' });
    if (!user) {
      throw new Error('User not found');
    }

    if (input.name !== undefined) {
      if (!input.name.trim()) {
        throw new Error('Name is required');
      }
      user.name = input.name.trim();
    }
    if (input.email !== undefined) {
      if (!input.email.trim()) {
        throw new Error('Email is required');
      }
      user.email = input.email.trim().toLowerCase();
    }
    if (input.password) {
      user.password = input.password;
    }
    if (input.status !== undefined) {
      user.status = input.status;
    }
    if (input.permissions !== undefined) {
      user.permissions = {
        canCreateApis: input.permissions.canCreateApis ?? user.permissions?.canCreateApis ?? false,
        canCreateProjects:
          input.permissions.canCreateProjects ?? user.permissions?.canCreateProjects ?? false,
      };
    }

    try {
      await user.save();
      const saved = await User.findById(user._id).select('-password');
      return toIClientUser(saved as unknown as UserDocument);
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        throw new Error('A user with this email already exists');
      }
      throw error;
    }
  }

  async deleteClientUser(clientId: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(clientId) || !Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid id');
    }

    const deleted = await User.findOneAndDelete({ _id: userId, clientId, role: 'user' });
    if (!deleted) {
      throw new Error('User not found');
    }
  }
}
