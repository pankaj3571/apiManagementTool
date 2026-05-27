"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
exports.requireClientScope = requireClientScope;
exports.requirePermission = requirePermission;
const user_model_1 = require("../models/user.model");
const token_util_1 = require("../utils/token.util");
function readBearerToken(req) {
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
function authenticate(req, res, next) {
    const token = readBearerToken(req);
    if (!token) {
        res.status(401).json({ message: 'Auth token missing or invalid' });
        return;
    }
    try {
        const payload = (0, token_util_1.verifyAccessToken)(token);
        const authUser = {
            userId: payload.userId,
            role: payload.role,
        };
        if (payload.clientId) {
            authUser.clientId = payload.clientId;
        }
        req.user = authUser;
        next();
    }
    catch (_a) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}
/** Allow only the given roles (e.g. authorize('admin') or authorize('admin', 'client')) */
function authorize(...roles) {
    return (req, res, next) => {
        const authReq = req;
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
function requireClientScope(paramName = 'clientId') {
    return (req, res, next) => {
        const authReq = req;
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
/** Team members need the matching permission; admin and client org admins bypass. */
function requirePermission(...keys) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const authReq = req;
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
            const doc = yield user_model_1.User.findById(userId).select('permissions').lean();
            const permissions = doc === null || doc === void 0 ? void 0 : doc.permissions;
            const allowed = keys.every((key) => Boolean(permissions === null || permissions === void 0 ? void 0 : permissions[key]));
            if (!allowed) {
                res.status(403).json({ message: 'Forbidden: insufficient permissions' });
                return;
            }
            next();
        }
        catch (_a) {
            res.status(500).json({ message: 'Internal server error' });
        }
    });
}
