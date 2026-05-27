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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
exports.userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    name: { type: String, trim: true },
    role: {
        type: String,
        enum: ['admin', 'client', 'user'],
        required: true,
        index: true,
    },
    clientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Client',
        index: true,
    },
    permissions: {
        canCreateApis: { type: Boolean, default: false },
        canCreateProjects: { type: Boolean, default: false },
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    mobile: { type: Number, sparse: true, unique: true },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        country: { type: String, default: '' },
        zip: { type: String, default: '' },
        latitude: { type: Number, default: 0 },
        longitude: { type: Number, default: 0 },
    },
    profilePicture: { type: String, default: '' },
    tokens: {
        accessToken: { type: String, default: '' },
        refreshToken: { type: String, default: '' },
    },
    lastLogin: { type: Date },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    isExpired: { type: Boolean, default: false },
}, { timestamps: true });
exports.userSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return;
        this.password = yield bcrypt_1.default.hash(this.password, SALT_ROUNDS);
    });
});
exports.userSchema.methods.comparePassword = function (candidate) {
    if (!candidate || !this.password) {
        return Promise.resolve(false);
    }
    return bcrypt_1.default.compare(candidate, this.password);
};
exports.User = mongoose_1.default.model('users', exports.userSchema);
