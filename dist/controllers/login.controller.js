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
const auth_service_1 = require("../services/auth.service");
class LoginController {
    constructor(authService) {
        this.authService = authService;
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ message: 'Email and password are required' });
                    return;
                }
                const { user, tokens } = yield this.authService.login(email, password);
                res.status(200).json({
                    data: Object.assign({ user }, tokens),
                    status: 200,
                    message: 'Login successful',
                });
            }
            catch (error) {
                if (error instanceof Error && error.message === 'User not found') {
                    res.status(404).json({ message: error.message });
                    return;
                }
                if (error instanceof Error &&
                    (error.message === 'Invalid password' || error.message === 'Account is not active')) {
                    res.status(401).json({ message: error.message });
                    return;
                }
                if (error instanceof Error &&
                    (error.message === 'JWT_SECRET is not configured' ||
                        error.message === 'JWT_REFRESH_SECRET is not configured')) {
                    res.status(500).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.refresh = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const refreshToken = (_a = req.body.refreshToken) !== null && _a !== void 0 ? _a : req.body.refresh_token;
                if (!refreshToken || typeof refreshToken !== 'string') {
                    res.status(400).json({ message: 'Refresh token is required' });
                    return;
                }
                const { user, tokens } = yield this.authService.refresh(refreshToken);
                res.status(200).json({
                    data: Object.assign({ user }, tokens),
                    status: 200,
                    message: 'Token refreshed successfully',
                });
            }
            catch (error) {
                if (error instanceof Error &&
                    (error.message === 'Invalid refresh token' ||
                        error.message === 'Invalid token payload' ||
                        error.name === 'JsonWebTokenError' ||
                        error.name === 'TokenExpiredError')) {
                    res.status(401).json({ message: 'Invalid or expired refresh token' });
                    return;
                }
                if (error instanceof Error && error.message === 'User not found') {
                    res.status(404).json({ message: error.message });
                    return;
                }
                if (error instanceof Error &&
                    (error.message === 'JWT_SECRET is not configured' ||
                        error.message === 'JWT_REFRESH_SECRET is not configured')) {
                    res.status(500).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = new LoginController(new auth_service_1.AuthService());
