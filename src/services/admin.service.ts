import { Types } from 'mongoose';
import { IAdmin, ICreateAdmin } from '../interfaces/admin.interface';
import { toIAdmin } from '../mappers/admin.mapper';
import { Admin, AdminDocument } from '../models/admin.model';

export class AdminService {
  async getAdmin(id: string): Promise<IAdmin> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid admin id');
    }

    const admin = await Admin.findById(id).select('-password');
    if (!admin) {
      throw new Error('Admin not found');
    }

    return toIAdmin(admin as unknown as AdminDocument);
  }

  async createAdmin(input: ICreateAdmin): Promise<IAdmin> {
    if (!input?.email || !input?.password) {
      throw new Error('Email and password are required');
    }

    try {
      const newAdmin = await Admin.create(input);
      return toIAdmin(newAdmin as unknown as AdminDocument);
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
