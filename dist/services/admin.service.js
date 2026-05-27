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
exports.AdminService = void 0;
const mongoose_1 = require("mongoose");
const user_mapper_1 = require("../mappers/user.mapper");
const user_model_1 = require("../models/user.model");
class AdminService {
    getAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid admin id');
            }
            const admin = yield user_model_1.User.findOne({ _id: id, role: 'admin' }).select('-password');
            if (!admin) {
                throw new Error('Admin not found');
            }
            return (0, user_mapper_1.toIAdmin)(admin);
        });
    }
    createAdmin(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(input === null || input === void 0 ? void 0 : input.email) || !(input === null || input === void 0 ? void 0 : input.password)) {
                throw new Error('Email and password are required');
            }
            try {
                const newAdmin = yield user_model_1.User.create(Object.assign(Object.assign({}, input), { role: 'admin' }));
                return (0, user_mapper_1.toIAdmin)(newAdmin);
            }
            catch (error) {
                if (error instanceof Error &&
                    'code' in error &&
                    error.code === 11000) {
                    throw new Error('Email already exists');
                }
                throw error;
            }
        });
    }
}
exports.AdminService = AdminService;
