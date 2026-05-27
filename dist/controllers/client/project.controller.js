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
const project_service_1 = require("../../services/project.service");
class ProjectController {
    constructor(projectService) {
        this.projectService = projectService;
        this.listProjects = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const clientId = String((_a = req.params.clientId) !== null && _a !== void 0 ? _a : '');
                const projects = yield this.projectService.listByClient(clientId);
                res.status(200).json(projects);
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
        this.createProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const clientId = String((_a = req.params.clientId) !== null && _a !== void 0 ? _a : '');
                const body = (_b = req.body.project) !== null && _b !== void 0 ? _b : req.body;
                const payload = Object.assign(Object.assign({}, body), { clientId });
                const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const project = yield this.projectService.createProject(payload, userId);
                res.status(201).json(project);
            }
            catch (error) {
                if (error instanceof Error &&
                    (error.message === 'Project name and client are required' ||
                        error.message === 'Invalid client id')) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                if (error instanceof Error && error.message === 'Client not found') {
                    res.status(404).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = new ProjectController(new project_service_1.ProjectService());
