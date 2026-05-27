"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIClient = toIClient;
function toIClient(doc) {
    return {
        id: doc._id.toString(),
        companyName: doc.companyName,
        contactName: doc.contactName || undefined,
        email: doc.email,
        phone: doc.phone || undefined,
        status: doc.status || 'active',
        notes: doc.notes || undefined,
        createdAt: doc.createdAt || new Date(),
        updatedAt: doc.updatedAt || new Date(),
    };
}
