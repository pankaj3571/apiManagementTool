import { IAdmin, IAdminAddress } from '../interfaces/admin.interface';
import { UserDocument } from '../models/user.model';

export function toIAdmin(doc: UserDocument): IAdmin {
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name || undefined,
    role: doc.role || 'admin' ,
    status: doc.status || 'active',
    mobile: doc.mobile?.toString() || undefined,
    address: doc.address as IAdminAddress | undefined,
    profilePicture: doc.profilePicture || undefined,
    tokens: doc.tokens || undefined,
    lastLogin: doc.lastLogin || undefined,
    isDeleted: doc.isDeleted || false,
    isVerified: doc.isVerified || false,
    isActive: doc.isActive ?? true,
    isBlocked: doc.isBlocked || false,
    isLocked: doc.isLocked || false,
    isExpired: doc.isExpired || false,
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date(),
  };
}
