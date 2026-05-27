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
exports.ProjectService = void 0;
const mongoose_1 = require("mongoose");
const project_mapper_1 = require("../mappers/project.mapper");
const client_model_1 = require("../models/client.model");
const project_model_1 = require("../models/project.model");
class ProjectService {
    getProject(projectId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(projectId) || !mongoose_1.Types.ObjectId.isValid(clientId)) {
                throw new Error('Invalid project or client id');
            }
            const project = yield project_model_1.Project.findOne({ _id: projectId, clientId });
            if (!project) {
                throw new Error('Project not found');
            }
            return (0, project_mapper_1.toIProject)(project);
        });
    }
    listByClient(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(clientId)) {
                throw new Error('Invalid client id');
            }
            const client = yield client_model_1.Client.findById(clientId);
            if (!client) {
                throw new Error('Client not found');
            }
            const projects = yield project_model_1.Project.find({ clientId }).sort({ createdAt: -1 });
            return projects.map((p) => (0, project_mapper_1.toIProject)(p));
        });
    }
    createProject(input, createdBy) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!((_a = input === null || input === void 0 ? void 0 : input.name) === null || _a === void 0 ? void 0 : _a.trim()) || !(input === null || input === void 0 ? void 0 : input.clientId)) {
                throw new Error('Project name and client are required');
            }
            if (!mongoose_1.Types.ObjectId.isValid(input.clientId)) {
                throw new Error('Invalid client id');
            }
            const client = yield client_model_1.Client.findById(input.clientId);
            if (!client) {
                throw new Error('Client not found');
            }
            const newProject = yield project_model_1.Project.create({
                name: input.name.trim(),
                description: (_b = input.description) === null || _b === void 0 ? void 0 : _b.trim(),
                clientId: input.clientId,
                createdBy,
                status: (_c = input.status) !== null && _c !== void 0 ? _c : 'active',
            });
            return (0, project_mapper_1.toIProject)(newProject);
        });
    }
}
exports.ProjectService = ProjectService;
