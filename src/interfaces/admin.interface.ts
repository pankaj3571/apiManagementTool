export type AdminRole = 'admin' | 'user';
export type AdminStatus = 'active' | 'inactive';

export interface IAdminAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
}

export interface ICreateAdmin {
  email: string;
  password: string;
  name?: string;
  role?: AdminRole;
  status?: AdminStatus;
  mobile?: string;
  address?: IAdminAddress;
  profilePicture?: string;
  isVerified?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
  isLocked?: boolean;
  isExpired?: boolean;
  isDeleted?: boolean;
}

export interface IAdmin {
  id: string;
  email: string;
  name?: string;
  role: AdminRole;
  status: AdminStatus;
  mobile?: string;
  address?: IAdminAddress;
  profilePicture?: string;
  isDeleted: boolean;
  isVerified: boolean;
  isActive: boolean;
  isBlocked: boolean;
  isLocked: boolean;
  isExpired: boolean;
  createdAt: Date;
  updatedAt: Date;
}
