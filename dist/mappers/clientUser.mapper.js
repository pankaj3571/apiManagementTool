"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIClientUser = toIClientUser;
function toIClientUser(doc) {
    var _a, _b, _c, _d;
    return {
        id: doc._id.toString(),
        name: doc.name,
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
