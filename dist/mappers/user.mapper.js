"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIAuthUser = toIAuthUser;
exports.toIAdmin = toIAdmin;
exports.toIClientUser = toIClientUser;
function toIAuthUser(doc) {
    var _a, _b, _c, _d;
    const authUser = {
        id: doc._id.toString(),
        email: doc.email,
        name: doc.name || undefined,
        role: doc.role,
        status: doc.status || 'active',
    };
    if ((doc.role === 'client' || doc.role === 'user') && doc.clientId) {
        authUser.clientId = doc.clientId.toString();
        if (doc.role === 'client') {
            authUser.permissions = {
                canCreateApis: true,
                canCreateProjects: true,
            };
        }
        else {
            authUser.permissions = {
                canCreateApis: (_b = (_a = doc.permissions) === null || _a === void 0 ? void 0 : _a.canCreateApis) !== null && _b !== void 0 ? _b : false,
                canCreateProjects: (_d = (_c = doc.permissions) === null || _c === void 0 ? void 0 : _c.canCreateProjects) !== null && _d !== void 0 ? _d : false,
            };
        }
    }
    return authUser;
}
function toIAdmin(doc) {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        id: doc._id.toString(),
        email: doc.email,
        name: doc.name || undefined,
        role: 'admin',
        status: doc.status || 'active',
        mobile: (_a = doc.mobile) === null || _a === void 0 ? void 0 : _a.toString(),
        address: doc.address,
        profilePicture: doc.profilePicture || undefined,
        tokens: doc.tokens || undefined,
        lastLogin: doc.lastLogin || undefined,
        isDeleted: (_b = doc.isDeleted) !== null && _b !== void 0 ? _b : false,
        isVerified: (_c = doc.isVerified) !== null && _c !== void 0 ? _c : false,
        isActive: (_d = doc.isActive) !== null && _d !== void 0 ? _d : true,
        isBlocked: (_e = doc.isBlocked) !== null && _e !== void 0 ? _e : false,
        isLocked: (_f = doc.isLocked) !== null && _f !== void 0 ? _f : false,
        isExpired: (_g = doc.isExpired) !== null && _g !== void 0 ? _g : false,
        createdAt: doc.createdAt || new Date(),
        updatedAt: doc.updatedAt || new Date(),
    };
}
function toIClientUser(doc) {
    var _a, _b, _c, _d;
    if (!doc.clientId) {
        throw new Error('Client user is missing clientId');
    }
    return {
        id: doc._id.toString(),
        name: doc.name || '',
        email: doc.email,
        clientId: doc.clientId.toString(),
        permissions: {
            canCreateApis: (_b = (_a = doc.permissions) === null || _a === void 0 ? void 0 : _a.canCreateApis) !== null && _b !== void 0 ? _b : false,
            canCreateProjects: (_d = (_c = doc.permissions) === null || _c === void 0 ? void 0 : _c.canCreateProjects) !== null && _d !== void 0 ? _d : false,
        },
        status: doc.status || 'active',
        createdAt: doc.createdAt || new Date(),
        updatedAt: doc.updatedAt || new Date(),
    };
}
