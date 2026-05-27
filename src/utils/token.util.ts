import jwt, { type SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import type { AuthRole } from '../interfaces/auth.interface';

function expiresIn(value: string | undefined, fallback: string): SignOptions['expiresIn'] {
  return (value ?? fallback) as SignOptions['expiresIn'];
}

export type TokenType = 'access' | 'refresh';

export interface TokenPayload {
  userId: string;
  role: AuthRole;
  clientId?: string;
  type: TokenType;
}

export interface SignTokenInput {
  userId: Types.ObjectId | string;
  role: AuthRole;
  clientId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

function getAccessSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return secret;
}

function getRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }
  return secret;
}

function buildJwtPayload(input: SignTokenInput, type: TokenType): Record<string, string> {
  const payload: Record<string, string> = {
    userId: String(input.userId),
    role: input.role,
    type,
  };
  if (input.clientId) {
    payload.clientId = input.clientId;
  }
  return payload;
}

export function signAccessToken(input: SignTokenInput): string {
  return jwt.sign(buildJwtPayload(input, 'access'), getAccessSecret(), {
    expiresIn: expiresIn(process.env.JWT_ACCESS_EXPIRES_IN, '1h'),
  });
}

export function signRefreshToken(input: SignTokenInput): string {
  return jwt.sign(buildJwtPayload(input, 'refresh'), getRefreshSecret(), {
    expiresIn: expiresIn(process.env.JWT_REFRESH_EXPIRES_IN, '7d'),
  });
}

export function signAuthTokens(input: SignTokenInput): AuthTokens {
  return {
    accessToken: signAccessToken(input),
    refreshToken: signRefreshToken(input),
  };
}

export function verifyAccessToken(token: string): TokenPayload {
  const payload = jwt.verify(token, getAccessSecret()) as jwt.JwtPayload & {
    userId?: unknown;
    role?: unknown;
    clientId?: unknown;
    type?: unknown;
  };
  if (payload.type !== 'access') {
    throw new Error('Invalid access token');
  }
  return normalizePayload(payload);
}

export function verifyRefreshToken(token: string): TokenPayload {
  const payload = jwt.verify(token, getRefreshSecret()) as jwt.JwtPayload & {
    userId?: unknown;
    role?: unknown;
    clientId?: unknown;
    type?: unknown;
  };
  if (payload.type !== 'refresh') {
    throw new Error('Invalid refresh token');
  }
  return normalizePayload(payload);
}

function normalizePayload(
  payload: jwt.JwtPayload & { userId?: unknown; role?: unknown; clientId?: unknown }
): TokenPayload {
  const raw = payload.userId;
  if (raw === undefined || raw === null) {
    throw new Error('Invalid token payload');
  }
  if (payload.role !== 'admin' && payload.role !== 'client' && payload.role !== 'user') {
    throw new Error('Invalid token payload');
  }
  const result: TokenPayload = {
    userId: typeof raw === 'string' ? raw : String(raw),
    role: payload.role,
    type: payload.type as TokenType,
  };
  if (payload.clientId !== undefined && payload.clientId !== null) {
    result.clientId = String(payload.clientId);
  }
  return result;
}
