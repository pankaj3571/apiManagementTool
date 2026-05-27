import { Types } from 'mongoose';
import { IAdmin, ICreateAdmin } from '../interfaces/admin.interface';
import { toIAdmin } from '../mappers/user.mapper';
import { User, UserDocument } from '../models/user.model';

export class AdminService {
  async getAdmin(id: string): Promise<IAdmin> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid admin id');
    }

    const admin = await User.findOne({ _id: id, role: 'admin' }).select('-password');
    if (!admin) {
      throw new Error('Admin not found');
    }

    return toIAdmin(admin as unknown as UserDocument);
  }

  async createAdmin(input: ICreateAdmin): Promise<IAdmin> {
    if (!input?.email || !input?.password) {
      throw new Error('Email and password are required');
    }

    try {
      const newAdmin = await User.create({
        ...input,
        role: 'admin',
      });
      return toIAdmin(newAdmin as unknown as UserDocument);
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }
}
