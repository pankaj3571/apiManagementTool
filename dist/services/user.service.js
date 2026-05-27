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
exports.UserService = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_mapper_1 = require("../mappers/admin.mapper");
class UserService {
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.User.findOne({ email }).select('+password');
                if (!user) {
                    throw new Error('User not found');
                }
                const isPasswordValid = yield user.comparePassword(password);
                console.log('isPasswordValid', isPasswordValid);
                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }
                const jwtSecret = process.env.JWT_SECRET;
                if (!jwtSecret) {
                    throw new Error('JWT_SECRET is not configured');
                }
                const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
                user.tokens.accessToken = token;
                user.lastLogin = new Date();
                yield user.save();
                return (0, admin_mapper_1.toIAdmin)(user);
            }
            catch (error) {
                console.log('error', error);
                throw error;
            }
        });
    }
}
exports.UserService = UserService;
