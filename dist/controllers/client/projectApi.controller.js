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
const api_service_1 = require("../../services/api.service");
const project_service_1 = require("../../services/project.service");
class ProjectApiController {
    constructor(apiService, projectService) {
        this.apiService = apiService;
        this.projectService = projectService;
        this.getProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const clientId = String((_a = req.params.clientId) !== null && _a !== void 0 ? _a : '');
                const projectId = String((_b = req.params.projectId) !== null && _b !== void 0 ? _b : '');
                const project = yield this.projectService.getProject(projectId, clientId);
                res.status(200).json(project);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Project not found') {
                    res.status(404).json({ message: error.message });
                    return;
                }
                if (error instanceof Error && error.message === 'Invalid project or client id') {
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.listApis = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const clientId = String((_a = req.params.clientId) !== null && _a !== void 0 ? _a : '');
                const projectId = String((_b = req.params.projectId) !== null && _b !== void 0 ? _b : '');
                const apis = yield this.apiService.listByProject(projectId, clientId);
                res.status(200).json(apis);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Project not found') {
                    res.status(404).json({ message: error.message });
                    return;
                }
                if (error instanceof Error && error.message === 'Invalid project or client id') {
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.createApi = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const clientId = String((_a = req.params.clientId) !== null && _a !== void 0 ? _a : '');
                const projectId = String((_b = req.params.projectId) !== null && _b !== void 0 ? _b : '');
                const body = (_c = req.body.api) !== null && _c !== void 0 ? _c : req.body;
                const payload = Object.assign(Object.assign({}, body), { clientId,
                    projectId });
                const api = yield this.apiService.createApi(payload);
                res.status(201).json(api);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Name, endpoint, and method are required') {
                    res.status(400).json({ message: error.message });
                    return;
                }
                if (error instanceof Error &&
                    (error.message === 'Project not found' || error.message === 'Invalid project or client id')) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.updateApi = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const clientId = String((_a = req.params.clientId) !== null && _a !== void 0 ? _a : '');
                const projectId = String((_b = req.params.projectId) !== null && _b !== void 0 ? _b : '');
                const apiId = String((_c = req.params.apiId) !== null && _c !== void 0 ? _c : '');
                const body = (_d = req.body.api) !== null && _d !== void 0 ? _d : req.body;
                const payload = Object.assign(Object.assign({}, body), { clientId, projectId });
                const api = yield this.apiService.updateApi(apiId, projectId, clientId, payload);
                res.status(200).json(api);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Name, endpoint, and method are required') {
                    res.status(400).json({ message: error.message });
                    return;
                }
                if (error instanceof Error &&
                    (error.message === 'API not found' ||
                        error.message === 'Project not found' ||
                        error.message === 'Invalid api, project, or client id')) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.deleteApi = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const clientId = String((_a = req.params.clientId) !== null && _a !== void 0 ? _a : '');
                const projectId = String((_b = req.params.projectId) !== null && _b !== void 0 ? _b : '');
                const apiId = String((_c = req.params.apiId) !== null && _c !== void 0 ? _c : '');
                yield this.apiService.deleteApi(apiId, projectId, clientId);
                res.status(204).send();
            }
            catch (error) {
                if (error instanceof Error &&
                    (error.message === 'API not found' ||
                        error.message === 'Project not found' ||
                        error.message === 'Invalid api, project, or client id')) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = new ProjectApiController(new api_service_1.ApiService(), new project_service_1.ProjectService());
