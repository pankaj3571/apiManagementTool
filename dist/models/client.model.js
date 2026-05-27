"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.clientSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.clientSchema = new mongoose_1.default.Schema({
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    notes: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.Client = mongoose_1.default.model('Client', exports.clientSchema);
