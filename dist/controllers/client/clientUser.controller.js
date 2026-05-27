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
const clientUser_service_1 = require("../../services/clientUser.service");
class ClientUserController {
    constructor(clientUserService) {
        this.clientUserService = clientUserService;
        this.listUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const clientId = String((_a = req.params.clientId) !== null && _a !== void 0 ? _a : '');
                const users = yield this.clientUserService.listByClient(clientId);
                res.status(200).json(users);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Client not found') {
                    res.status(404).json({ message: error.message });
                    return;
                }
                if (error instanceof Error && error.message === 'Invalid client id') {
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const authReq = req;
                const clientId = String((_a = req.params.clientId) !== null && _a !== void 0 ? _a : '');
                const body = (_b = req.body.user) !== null && _b !== void 0 ? _b : req.body;
                const payload = Object.assign(Object.assign({}, body), { clientId });
                if (authReq.user.role !== 'admin') {
                    payload.role = 'user';
                }
                const user = yield this.clientUserService.createClientUser(payload);
                res.status(201).json(user);
            }
            catch (error) {
                if (error instanceof Error &&
                    (error.message === 'Name, email, password, and client are required' ||
                        error.message === 'Invalid client id')) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                if (error instanceof Error && error.message === 'Client not found') {
                    res.status(404).json({ message: error.message });
                    return;
                }
                if (error instanceof Error && error.message === 'A user with this email already exists') {
                    res.status(409).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const clientId = String((_a = req.params.clientId) !== null && _a !== void 0 ? _a : '');
                const userId = String((_b = req.params.userId) !== null && _b !== void 0 ? _b : '');
                const body = (_c = req.body.user) !== null && _c !== void 0 ? _c : req.body;
                const payload = body;
                const user = yield this.clientUserService.updateClientUser(clientId, userId, payload);
                res.status(200).json(user);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'User not found') {
                    res.status(404).json({ message: error.message });
                    return;
                }
                if (error instanceof Error &&
                    (error.message === 'Invalid id' ||
                        error.message === 'Name is required' ||
                        error.message === 'Email is required')) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                if (error instanceof Error && error.message === 'A user with this email already exists') {
                    res.status(409).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const authReq = req;
                const clientId = String((_a = req.params.clientId) !== null && _a !== void 0 ? _a : '');
                const userId = String((_b = req.params.userId) !== null && _b !== void 0 ? _b : '');
                if (authReq.user.userId === userId) {
                    res.status(400).json({ message: 'You cannot delete your own account' });
                    return;
                }
                yield this.clientUserService.deleteClientUser(clientId, userId);
                res.status(204).send();
            }
            catch (error) {
                if (error instanceof Error && error.message === 'User not found') {
                    res.status(404).json({ message: error.message });
                    return;
                }
                if (error instanceof Error && error.message === 'Invalid id') {
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = new ClientUserController(new clientUser_service_1.ClientUserService());
