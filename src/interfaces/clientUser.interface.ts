export type ClientUserStatus = 'active' | 'inactive';

export interface IClientUserPermissions {
  canCreateApis: boolean;
  canCreateProjects: boolean;
}

export interface ICreateClientUser {
  name: string;
  email: string;
  password: string;
  clientId: string;
  role?: 'user' | 'client';
  permissions?: Partial<IClientUserPermissions>;
  status?: ClientUserStatus;
}

export interface IUpdateClientUser {
  name?: string;
  email?: string;
  password?: string;
  permissions?: Partial<IClientUserPermissions>;
  status?: ClientUserStatus;
}

export interface IClientUser {
  id: string;
  name: string;
  email: string;
  clientId: string;
  permissions: IClientUserPermissions;
  status: ClientUserStatus;
  createdAt: Date;
  updatedAt: Date;
}
