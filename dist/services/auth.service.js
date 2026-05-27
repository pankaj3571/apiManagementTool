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
exports.AuthService = void 0;
const mongoose_1 = require("mongoose");
const user_mapper_1 = require("../mappers/user.mapper");
const user_model_1 = require("../models/user.model");
const token_util_1 = require("../utils/token.util");
class AuthService {
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedEmail = email.trim().toLowerCase();
            const user = yield user_model_1.User.findOne({ email: normalizedEmail }).select('+password');
            if (!user) {
                throw new Error('User not found');
            }
            const doc = user;
            const isPasswordValid = yield doc.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            if (!this.isAccountActive(doc)) {
                throw new Error('Account is not active');
            }
            return this.issueTokens(doc);
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const payload = (0, token_util_1.verifyRefreshToken)(refreshToken);
            if (!mongoose_1.Types.ObjectId.isValid(payload.userId)) {
                throw new Error('Invalid refresh token');
            }
            const user = yield user_model_1.User.findById(payload.userId);
            if (!user) {
                throw new Error('User not found');
            }
            const doc = user;
            if (doc.role !== payload.role) {
                throw new Error('Invalid refresh token');
            }
            if (((_a = doc.tokens) === null || _a === void 0 ? void 0 : _a.refreshToken) !== refreshToken) {
                throw new Error('Invalid refresh token');
            }
            if (!this.isAccountActive(doc)) {
                throw new Error('Account is not active');
            }
            return this.issueTokens(doc);
        });
    }
    isAccountActive(user) {
        if (user.status !== 'active') {
            return false;
        }
        if (user.role === 'admin' && (!user.isActive || user.isBlocked || user.isDeleted)) {
            return false;
        }
        return true;
    }
    issueTokens(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = user.role;
            const tokenInput = {
                userId: user._id,
                role,
            };
            if (role === 'client' || role === 'user') {
                if (!user.clientId) {
                    throw new Error('Client account is misconfigured');
                }
                tokenInput.clientId = user.clientId.toString();
            }
            const tokens = (0, token_util_1.signAuthTokens)(tokenInput);
            user.tokens = {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            };
            user.lastLogin = new Date();
            yield user.save();
            return {
                user: (0, user_mapper_1.toIAuthUser)(user),
                tokens,
            };
        });
    }
}
exports.AuthService = AuthService;
