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
exports.ClientUserService = void 0;
const mongoose_1 = require("mongoose");
const user_mapper_1 = require("../mappers/user.mapper");
const client_model_1 = require("../models/client.model");
const user_model_1 = require("../models/user.model");
class ClientUserService {
    listByClient(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(clientId)) {
                throw new Error('Invalid client id');
            }
            const client = yield client_model_1.Client.findById(clientId);
            if (!client) {
                throw new Error('Client not found');
            }
            const users = yield user_model_1.User.find({ role: 'user', clientId })
                .select('-password')
                .sort({ createdAt: -1 });
            return users.map((u) => (0, user_mapper_1.toIClientUser)(u));
        });
    }
    createClientUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            if (!((_a = input === null || input === void 0 ? void 0 : input.name) === null || _a === void 0 ? void 0 : _a.trim()) || !((_b = input === null || input === void 0 ? void 0 : input.email) === null || _b === void 0 ? void 0 : _b.trim()) || !(input === null || input === void 0 ? void 0 : input.password) || !(input === null || input === void 0 ? void 0 : input.clientId)) {
                throw new Error('Name, email, password, and client are required');
            }
            if (!mongoose_1.Types.ObjectId.isValid(input.clientId)) {
                throw new Error('Invalid client id');
            }
            const client = yield client_model_1.Client.findById(input.clientId);
            if (!client) {
                throw new Error('Client not found');
            }
            try {
                const memberRole = input.role === 'client' ? 'client' : 'user';
                const permissions = memberRole === 'client'
                    ? { canCreateApis: true, canCreateProjects: true }
                    : {
                        canCreateApis: (_d = (_c = input.permissions) === null || _c === void 0 ? void 0 : _c.canCreateApis) !== null && _d !== void 0 ? _d : false,
                        canCreateProjects: (_f = (_e = input.permissions) === null || _e === void 0 ? void 0 : _e.canCreateProjects) !== null && _f !== void 0 ? _f : false,
                    };
                const newUser = yield user_model_1.User.create({
                    name: input.name.trim(),
                    email: input.email.trim().toLowerCase(),
                    password: input.password,
                    role: memberRole,
                    clientId: input.clientId,
                    permissions,
                    status: (_g = input.status) !== null && _g !== void 0 ? _g : 'active',
                });
                const saved = yield user_model_1.User.findById(newUser._id).select('-password');
                return (0, user_mapper_1.toIClientUser)(saved);
            }
            catch (error) {
                if (error instanceof Error &&
                    'code' in error &&
                    error.code === 11000) {
                    throw new Error('A user with this email already exists');
                }
                throw error;
            }
        });
    }
    updateClientUser(clientId, userId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            if (!mongoose_1.Types.ObjectId.isValid(clientId) || !mongoose_1.Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid id');
            }
            const user = yield user_model_1.User.findOne({ _id: userId, clientId, role: 'user' });
            if (!user) {
                throw new Error('User not found');
            }
            if (input.name !== undefined) {
                if (!input.name.trim()) {
                    throw new Error('Name is required');
                }
                user.name = input.name.trim();
            }
            if (input.email !== undefined) {
                if (!input.email.trim()) {
                    throw new Error('Email is required');
                }
                user.email = input.email.trim().toLowerCase();
            }
            if (input.password) {
                user.password = input.password;
            }
            if (input.status !== undefined) {
                user.status = input.status;
            }
            if (input.permissions !== undefined) {
                user.permissions = {
                    canCreateApis: (_c = (_a = input.permissions.canCreateApis) !== null && _a !== void 0 ? _a : (_b = user.permissions) === null || _b === void 0 ? void 0 : _b.canCreateApis) !== null && _c !== void 0 ? _c : false,
                    canCreateProjects: (_f = (_d = input.permissions.canCreateProjects) !== null && _d !== void 0 ? _d : (_e = user.permissions) === null || _e === void 0 ? void 0 : _e.canCreateProjects) !== null && _f !== void 0 ? _f : false,
                };
            }
            try {
                yield user.save();
                const saved = yield user_model_1.User.findById(user._id).select('-password');
                return (0, user_mapper_1.toIClientUser)(saved);
            }
            catch (error) {
                if (error instanceof Error &&
                    'code' in error &&
                    error.code === 11000) {
                    throw new Error('A user with this email already exists');
                }
                throw error;
            }
        });
    }
    deleteClientUser(clientId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(clientId) || !mongoose_1.Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid id');
            }
            const deleted = yield user_model_1.User.findOneAndDelete({ _id: userId, clientId, role: 'user' });
            if (!deleted) {
                throw new Error('User not found');
            }
        });
    }
}
exports.ClientUserService = ClientUserService;
