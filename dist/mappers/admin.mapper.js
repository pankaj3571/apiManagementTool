"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIAdmin = toIAdmin;
function toIAdmin(doc) {
    var _a, _b;
    return {
        id: doc._id.toString(),
        email: doc.email,
        name: doc.name || undefined,
        role: doc.role || 'admin',
        status: doc.status || 'active',
        mobile: ((_a = doc.mobile) === null || _a === void 0 ? void 0 : _a.toString()) || undefined,
        address: doc.address,
        profilePicture: doc.profilePicture || undefined,
        tokens: doc.tokens || undefined,
        lastLogin: doc.lastLogin || undefined,
        isDeleted: doc.isDeleted || false,
        isVerified: doc.isVerified || false,
        isActive: (_b = doc.isActive) !== null && _b !== void 0 ? _b : true,
        isBlocked: doc.isBlocked || false,
        isLocked: doc.isLocked || false,
        isExpired: doc.isExpired || false,
        createdAt: doc.createdAt || new Date(),
        updatedAt: doc.updatedAt || new Date(),
    };
}
