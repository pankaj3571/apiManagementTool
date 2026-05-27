"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../../controllers/admin/admin.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/** Public: bootstrap first admin */
router.post('/create', admin_controller_1.default.createAdmin);
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), admin_controller_1.default.getAdmin);
exports.default = router;
