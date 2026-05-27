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
exports.ApiService = void 0;
const mongoose_1 = require("mongoose");
const api_mapper_1 = require("../mappers/api.mapper");
const api_model_1 = require("../models/api.model");
const project_model_1 = require("../models/project.model");
const apiTest_service_1 = require("./apiTest.service");
class ApiService {
    attachTestResponse(apiId, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const testResult = yield (0, apiTest_service_1.testApiDefinition)({
                method: config.method,
                endpoint: config.endpoint,
                baseUrl: config.baseUrl,
                bodyType: config.bodyType,
                pathParams: config.pathParams,
                queryParams: config.queryParams,
                bearerToken: config.bearerToken,
                fields: config.fields,
                fileFields: config.fileFields,
            });
            const updated = yield api_model_1.Api.findByIdAndUpdate(apiId, { lastTestResponse: testResult }, { new: true });
            if (!updated) {
                throw new Error('API not found');
            }
            return (0, api_mapper_1.toIApi)(updated);
        });
    }
    getApi(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid api id');
            }
            const api = yield api_model_1.Api.findById(id);
            if (!api) {
                throw new Error('API not found');
            }
            return (0, api_mapper_1.toIApi)(api);
        });
    }
    listByProject(projectId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(projectId) || !mongoose_1.Types.ObjectId.isValid(clientId)) {
                throw new Error('Invalid project or client id');
            }
            const project = yield project_model_1.Project.findOne({ _id: projectId, clientId });
            if (!project) {
                throw new Error('Project not found');
            }
            const apis = yield api_model_1.Api.find({ projectId, clientId }).sort({ createdAt: -1 });
            return apis.map((a) => (0, api_mapper_1.toIApi)(a));
        });
    }
    createApi(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            if (!((_a = input === null || input === void 0 ? void 0 : input.name) === null || _a === void 0 ? void 0 : _a.trim()) || !((_b = input === null || input === void 0 ? void 0 : input.endpoint) === null || _b === void 0 ? void 0 : _b.trim()) || !(input === null || input === void 0 ? void 0 : input.method)) {
                throw new Error('Name, endpoint, and method are required');
            }
            if (input.projectId && input.clientId) {
                if (!mongoose_1.Types.ObjectId.isValid(input.projectId) || !mongoose_1.Types.ObjectId.isValid(input.clientId)) {
                    throw new Error('Invalid project or client id');
                }
                const project = yield project_model_1.Project.findOne({ _id: input.projectId, clientId: input.clientId });
                if (!project) {
                    throw new Error('Project not found');
                }
            }
            const newApi = yield api_model_1.Api.create(Object.assign(Object.assign({}, input), { name: input.name.trim(), endpoint: input.endpoint.trim(), tags: (_d = (_c = input.tags) === null || _c === void 0 ? void 0 : _c.filter(Boolean)) !== null && _d !== void 0 ? _d : [], pathParams: (_f = (_e = input.pathParams) === null || _e === void 0 ? void 0 : _e.filter((p) => { var _a; return (_a = p.name) === null || _a === void 0 ? void 0 : _a.trim(); })) !== null && _f !== void 0 ? _f : [], queryParams: (_h = (_g = input.queryParams) === null || _g === void 0 ? void 0 : _g.filter((p) => { var _a; return (_a = p.name) === null || _a === void 0 ? void 0 : _a.trim(); })) !== null && _h !== void 0 ? _h : [], bearerToken: (_j = input.bearerToken) === null || _j === void 0 ? void 0 : _j.trim(), fields: (_l = (_k = input.fields) === null || _k === void 0 ? void 0 : _k.filter((f) => { var _a; return (_a = f.name) === null || _a === void 0 ? void 0 : _a.trim(); })) !== null && _l !== void 0 ? _l : [], fileFields: (_o = (_m = input.fileFields) === null || _m === void 0 ? void 0 : _m.filter((f) => { var _a; return (_a = f.name) === null || _a === void 0 ? void 0 : _a.trim(); })) !== null && _o !== void 0 ? _o : [] }));
            return this.attachTestResponse(newApi._id, {
                method: input.method,
                endpoint: input.endpoint.trim(),
                baseUrl: (_p = input.baseUrl) === null || _p === void 0 ? void 0 : _p.trim(),
                bodyType: input.bodyType,
                pathParams: input.pathParams,
                queryParams: input.queryParams,
                bearerToken: (_q = input.bearerToken) === null || _q === void 0 ? void 0 : _q.trim(),
                fields: input.fields,
                fileFields: input.fileFields,
            });
        });
    }
    findProjectApi(apiId, projectId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(apiId) || !mongoose_1.Types.ObjectId.isValid(projectId) || !mongoose_1.Types.ObjectId.isValid(clientId)) {
                throw new Error('Invalid api, project, or client id');
            }
            const project = yield project_model_1.Project.findOne({ _id: projectId, clientId });
            if (!project) {
                throw new Error('Project not found');
            }
            const api = yield api_model_1.Api.findOne({ _id: apiId, projectId, clientId });
            if (!api) {
                throw new Error('API not found');
            }
            return api;
        });
    }
    updateApi(apiId, projectId, clientId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            if (!((_a = input === null || input === void 0 ? void 0 : input.name) === null || _a === void 0 ? void 0 : _a.trim()) || !((_b = input === null || input === void 0 ? void 0 : input.endpoint) === null || _b === void 0 ? void 0 : _b.trim()) || !(input === null || input === void 0 ? void 0 : input.method)) {
                throw new Error('Name, endpoint, and method are required');
            }
            yield this.findProjectApi(apiId, projectId, clientId);
            const updated = yield api_model_1.Api.findOneAndUpdate({ _id: apiId, projectId, clientId }, Object.assign({ name: input.name.trim(), endpoint: input.endpoint.trim(), method: input.method, description: (_c = input.description) === null || _c === void 0 ? void 0 : _c.trim(), version: (_d = input.version) === null || _d === void 0 ? void 0 : _d.trim(), status: input.status, baseUrl: (_e = input.baseUrl) === null || _e === void 0 ? void 0 : _e.trim(), bodyType: input.bodyType, pathParams: (_g = (_f = input.pathParams) === null || _f === void 0 ? void 0 : _f.filter((p) => { var _a; return (_a = p.name) === null || _a === void 0 ? void 0 : _a.trim(); })) !== null && _g !== void 0 ? _g : [], queryParams: (_j = (_h = input.queryParams) === null || _h === void 0 ? void 0 : _h.filter((p) => { var _a; return (_a = p.name) === null || _a === void 0 ? void 0 : _a.trim(); })) !== null && _j !== void 0 ? _j : [], bearerToken: (_k = input.bearerToken) === null || _k === void 0 ? void 0 : _k.trim(), fields: (_m = (_l = input.fields) === null || _l === void 0 ? void 0 : _l.filter((f) => { var _a; return (_a = f.name) === null || _a === void 0 ? void 0 : _a.trim(); })) !== null && _m !== void 0 ? _m : [], fileFields: (_p = (_o = input.fileFields) === null || _o === void 0 ? void 0 : _o.filter((f) => { var _a; return (_a = f.name) === null || _a === void 0 ? void 0 : _a.trim(); })) !== null && _p !== void 0 ? _p : [] }, (input.tags ? { tags: input.tags.filter(Boolean) } : {})), { new: true });
            if (!updated) {
                throw new Error('API not found');
            }
            return this.attachTestResponse(updated._id, {
                method: input.method,
                endpoint: input.endpoint.trim(),
                baseUrl: (_q = input.baseUrl) === null || _q === void 0 ? void 0 : _q.trim(),
                bodyType: input.bodyType,
                pathParams: input.pathParams,
                queryParams: input.queryParams,
                bearerToken: (_r = input.bearerToken) === null || _r === void 0 ? void 0 : _r.trim(),
                fields: input.fields,
                fileFields: input.fileFields,
            });
        });
    }
    deleteApi(apiId, projectId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const api = yield this.findProjectApi(apiId, projectId, clientId);
            yield api_model_1.Api.deleteOne({ _id: api._id });
        });
    }
}
exports.ApiService = ApiService;
