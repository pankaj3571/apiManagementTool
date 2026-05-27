import { IAuthUser } from '../interfaces/auth.interface';
import { IAdmin, IAdminAddress } from '../interfaces/admin.interface';
import { IClientUser } from '../interfaces/clientUser.interface';
import { UserDocument } from '../models/user.model';

export function toIAuthUser(doc: UserDocument): IAuthUser {
  const authUser: IAuthUser = {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name || undefined,
    role: doc.role as IAuthUser['role'],
    status: doc.status || 'active',
  };

  if ((doc.role === 'client' || doc.role === 'user') && doc.clientId) {
    authUser.clientId = doc.clientId.toString();
    if (doc.role === 'client') {
      authUser.permissions = {
        canCreateApis: true,
        canCreateProjects: true,
      };
    } else {
      authUser.permissions = {
        canCreateApis: doc.permissions?.canCreateApis ?? false,
        canCreateProjects: doc.permissions?.canCreateProjects ?? false,
      };
    }
  }

  return authUser;
}

export function toIAdmin(doc: UserDocument): IAdmin {
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name || undefined,
    role: 'admin',
    status: doc.status || 'active',
    mobile: doc.mobile?.toString(),
    address: doc.address as IAdminAddress | undefined,
    profilePicture: doc.profilePicture || undefined,
    tokens: doc.tokens || undefined,
    lastLogin: doc.lastLogin || undefined,
    isDeleted: doc.isDeleted ?? false,
    isVerified: doc.isVerified ?? false,
    isActive: doc.isActive ?? true,
    isBlocked: doc.isBlocked ?? false,
    isLocked: doc.isLocked ?? false,
    isExpired: doc.isExpired ?? false,
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date(),
  };
}

export function toIClientUser(doc: UserDocument): IClientUser {
  if (!doc.clientId) {
    throw new Error('Client user is missing clientId');
  }
  return {
    id: doc._id.toString(),
    name: doc.name || '',
    email: doc.email,
    clientId: doc.clientId.toString(),
    permissions: {
      canCreateApis: doc.permissions?.canCreateApis ?? false,
      canCreateProjects: doc.permissions?.canCreateProjects ?? false,
    },
    status: doc.status || 'active',
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date(),
  };
}
