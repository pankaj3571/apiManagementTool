"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIProject = toIProject;
function toIProject(doc) {
    return {
        id: doc._id.toString(),
        name: doc.name,
        description: doc.description || undefined,
        clientId: doc.clientId.toString(),
        createdBy: doc.createdBy.toString(),
        status: doc.status || 'active',
        createdAt: doc.createdAt || new Date(),
        updatedAt: doc.updatedAt || new Date(),
    };
}
