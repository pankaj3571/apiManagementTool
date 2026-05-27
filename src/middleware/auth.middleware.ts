import type { NextFunction, Request, Response } from 'express';
import type { AuthRole } from '../interfaces/auth.interface';
import type { IClientUserPermissions } from '../interfaces/clientUser.interface';
import { User } from '../models/user.model';
import { verifyAccessToken } from '../utils/token.util';

export interface AuthUser {
  userId: string;
  role: AuthRole;
  clientId?: string;
}

/** Use in handlers after `authenticate` when you need `req.user` */
export type AuthenticatedRequest = Request & {
  user: AuthUser;
};

function readBearerToken(req: Request): string | null {
  const authToken = req.headers['auth-token'];
  if (typeof authToken === 'string' && authToken.startsWith('Bearer ')) {
    return authToken.slice(7).trim();
  }

  const authorization = req.headers.authorization;
  if (typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
    return authorization.slice(7).trim();
  }

  return null;
}

/**
 * Requires `auth-token: Bearer <access_token>` or `Authorization: Bearer <access_token>`.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = readBearerToken(req);
  if (!token) {
    res.status(401).json({ message: 'Auth token missing or invalid' });
    return;
  }
  try {
    const payload = verifyAccessToken(token);
    const authUser: AuthUser = {
      userId: payload.userId,
      role: payload.role,
    };
    if (payload.clientId) {
      authUser.clientId = payload.clientId;
    }
    (req as AuthenticatedRequest).user = authUser;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/** Allow only the given roles (e.g. authorize('admin') or authorize('admin', 'client')) */
export function authorize(...roles: AuthRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (!roles.includes(authReq.user.role)) {
      res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      return;
    }
    next();
  };
}

/**
 * Client users may only access their own `clientId`.
 * Admins bypass this check.
 */
export function requireClientScope(paramName = 'clientId') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (authReq.user.role === 'admin') {
      next();
      return;
    }
    const resourceId = req.params[paramName];
    if (!resourceId || authReq.user.clientId !== resourceId) {
      res.status(403).json({ message: 'Forbidden: cannot access this client' });
      return;
    }
    next();
  };
}

type PermissionKey = keyof IClientUserPermissions;

/** Team members need the matching permission; admin and client org admins bypass. */
export function requirePermission(...keys: PermissionKey[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const { role, userId } = authReq.user;
    if (role === 'admin' || role === 'client') {
      next();
      return;
    }
    if (role !== 'user') {
      res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      return;
    }
    try {
      const doc = await User.findById(userId).select('permissions').lean();
      const permissions = doc?.permissions;
      const allowed = keys.every((key) => Boolean(permissions?.[key]));
      if (!allowed) {
        res.status(403).json({ message: 'Forbidden: insufficient permissions' });
        return;
      }
      next();
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
