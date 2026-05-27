"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = exports.projectSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.projectSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    clientId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'users', required: true },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
}, { timestamps: true });
exports.Project = mongoose_1.default.model('Project', exports.projectSchema);
