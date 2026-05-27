import { AuthTokens } from '../utils/token.util';
import { IClientUserPermissions } from './clientUser.interface';

export type AuthRole = 'admin' | 'client' | 'user';

export interface IAuthUser {
  id: string;
  email: string;
  name?: string;
  role: AuthRole;
  clientId?: string;
  permissions?: IClientUserPermissions;
  status?: string;
}

export interface LoginResult {
  user: IAuthUser;
  tokens: AuthTokens;
}
