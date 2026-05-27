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
const admin_service_1 = require("../../services/admin.service");
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
        this.getAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const admin = yield this.adminService.getAdmin(id);
                res.status(200).json(admin);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Admin not found') {
                    res.status(404).json({ message: error.message });
                    return;
                }
                if (error instanceof Error && error.message === 'Invalid admin id') {
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.createAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const payload = (_a = req.body.admin) !== null && _a !== void 0 ? _a : req.body;
                //   console.log('payload', payload);
                const newAdmin = yield this.adminService.createAdmin(payload);
                console.log('newAdmin', newAdmin);
                res.status(201).json(newAdmin);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Email and password are required') {
                    res.status(400).json({ message: error.message });
                    return;
                }
                if (error instanceof Error && error.message === 'Email already exists') {
                    res.status(409).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = new AdminController(new admin_service_1.AdminService());
