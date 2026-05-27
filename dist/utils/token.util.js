"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.signAuthTokens = signAuthTokens;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function expiresIn(value, fallback) {
    return (value !== null && value !== void 0 ? value : fallback);
}
function getAccessSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return secret;
}
function getRefreshSecret() {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not configured');
    }
    return secret;
}
function buildJwtPayload(input, type) {
    const payload = {
        userId: String(input.userId),
        role: input.role,
        type,
    };
    if (input.clientId) {
        payload.clientId = input.clientId;
    }
    return payload;
}
function signAccessToken(input) {
    return jsonwebtoken_1.default.sign(buildJwtPayload(input, 'access'), getAccessSecret(), {
        expiresIn: expiresIn(process.env.JWT_ACCESS_EXPIRES_IN, '1h'),
    });
}
function signRefreshToken(input) {
    return jsonwebtoken_1.default.sign(buildJwtPayload(input, 'refresh'), getRefreshSecret(), {
        expiresIn: expiresIn(process.env.JWT_REFRESH_EXPIRES_IN, '7d'),
    });
}
function signAuthTokens(input) {
    return {
        accessToken: signAccessToken(input),
        refreshToken: signRefreshToken(input),
    };
}
function verifyAccessToken(token) {
    const payload = jsonwebtoken_1.default.verify(token, getAccessSecret());
    if (payload.type !== 'access') {
        throw new Error('Invalid access token');
    }
    return normalizePayload(payload);
}
function verifyRefreshToken(token) {
    const payload = jsonwebtoken_1.default.verify(token, getRefreshSecret());
    if (payload.type !== 'refresh') {
        throw new Error('Invalid refresh token');
    }
    return normalizePayload(payload);
}
function normalizePayload(payload) {
    const raw = payload.userId;
    if (raw === undefined || raw === null) {
        throw new Error('Invalid token payload');
    }
    if (payload.role !== 'admin' && payload.role !== 'client' && payload.role !== 'user') {
        throw new Error('Invalid token payload');
    }
    const result = {
        userId: typeof raw === 'string' ? raw : String(raw),
        role: payload.role,
        type: payload.type,
    };
    if (payload.clientId !== undefined && payload.clientId !== null) {
        result.clientId = String(payload.clientId);
    }
    return result;
}
