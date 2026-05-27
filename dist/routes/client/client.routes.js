"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_controller_1 = __importDefault(require("../../controllers/client/client.controller"));
const clientUser_controller_1 = __importDefault(require("../../controllers/client/clientUser.controller"));
const project_controller_1 = __importDefault(require("../../controllers/client/project.controller"));
const projectApi_controller_1 = __importDefault(require("../../controllers/client/projectApi.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
const portalRoles = ['admin', 'client', 'user'];
const manageRoles = ['admin', 'client'];
/** Admin-only: manage all clients */
router.get('/', (0, auth_middleware_1.authorize)('admin'), client_controller_1.default.listClients);
router.post('/create', (0, auth_middleware_1.authorize)('admin'), client_controller_1.default.createClient);
router.get('/:id', (0, auth_middleware_1.authorize)(...portalRoles), (0, auth_middleware_1.requireClientScope)('id'), client_controller_1.default.getClient);
router.put('/:id', (0, auth_middleware_1.authorize)('admin', 'client'), (0, auth_middleware_1.requireClientScope)('id'), client_controller_1.default.updateClient);
router.delete('/:id', (0, auth_middleware_1.authorize)('admin'), client_controller_1.default.deleteClient);
/** Admin or client org admin: manage team users */
router.get('/:clientId/users', (0, auth_middleware_1.authorize)(...manageRoles), (0, auth_middleware_1.requireClientScope)('clientId'), clientUser_controller_1.default.listUsers);
router.post('/:clientId/users', (0, auth_middleware_1.authorize)(...manageRoles), (0, auth_middleware_1.requireClientScope)('clientId'), clientUser_controller_1.default.createUser);
router.put('/:clientId/users/:userId', (0, auth_middleware_1.authorize)(...manageRoles), (0, auth_middleware_1.requireClientScope)('clientId'), clientUser_controller_1.default.updateUser);
router.delete('/:clientId/users/:userId', (0, auth_middleware_1.authorize)(...manageRoles), (0, auth_middleware_1.requireClientScope)('clientId'), clientUser_controller_1.default.deleteUser);
router.get('/:clientId/projects', (0, auth_middleware_1.authorize)(...portalRoles), (0, auth_middleware_1.requireClientScope)('clientId'), project_controller_1.default.listProjects);
router.post('/:clientId/projects', (0, auth_middleware_1.authorize)(...portalRoles), (0, auth_middleware_1.requireClientScope)('clientId'), (0, auth_middleware_1.requirePermission)('canCreateProjects'), project_controller_1.default.createProject);
router.get('/:clientId/projects/:projectId', (0, auth_middleware_1.authorize)(...portalRoles), (0, auth_middleware_1.requireClientScope)('clientId'), projectApi_controller_1.default.getProject);
router.get('/:clientId/projects/:projectId/apis', (0, auth_middleware_1.authorize)(...portalRoles), (0, auth_middleware_1.requireClientScope)('clientId'), projectApi_controller_1.default.listApis);
router.post('/:clientId/projects/:projectId/apis', (0, auth_middleware_1.authorize)(...portalRoles), (0, auth_middleware_1.requireClientScope)('clientId'), (0, auth_middleware_1.requirePermission)('canCreateApis'), projectApi_controller_1.default.createApi);
router.put('/:clientId/projects/:projectId/apis/:apiId', (0, auth_middleware_1.authorize)(...manageRoles), (0, auth_middleware_1.requireClientScope)('clientId'), projectApi_controller_1.default.updateApi);
router.delete('/:clientId/projects/:projectId/apis/:apiId', (0, auth_middleware_1.authorize)(...manageRoles), (0, auth_middleware_1.requireClientScope)('clientId'), projectApi_controller_1.default.deleteApi);
exports.default = router;
