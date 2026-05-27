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
exports.ClientService = void 0;
const mongoose_1 = require("mongoose");
const client_mapper_1 = require("../mappers/client.mapper");
const api_model_1 = require("../models/api.model");
const client_model_1 = require("../models/client.model");
const project_model_1 = require("../models/project.model");
const user_model_1 = require("../models/user.model");
class ClientService {
    listClients() {
        return __awaiter(this, void 0, void 0, function* () {
            const clients = yield client_model_1.Client.find().sort({ createdAt: -1 });
            return clients.map((c) => (0, client_mapper_1.toIClient)(c));
        });
    }
    getClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid client id');
            }
            const client = yield client_model_1.Client.findById(id);
            if (!client) {
                throw new Error('Client not found');
            }
            return (0, client_mapper_1.toIClient)(client);
        });
    }
    createClient(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            if (!((_a = input === null || input === void 0 ? void 0 : input.companyName) === null || _a === void 0 ? void 0 : _a.trim()) || !((_b = input === null || input === void 0 ? void 0 : input.email) === null || _b === void 0 ? void 0 : _b.trim())) {
                throw new Error('Company name and email are required');
            }
            try {
                const newClient = yield client_model_1.Client.create(Object.assign(Object.assign({}, input), { companyName: input.companyName.trim(), contactName: (_c = input.contactName) === null || _c === void 0 ? void 0 : _c.trim(), email: input.email.trim().toLowerCase(), phone: (_d = input.phone) === null || _d === void 0 ? void 0 : _d.trim(), notes: (_e = input.notes) === null || _e === void 0 ? void 0 : _e.trim() }));
                return (0, client_mapper_1.toIClient)(newClient);
            }
            catch (error) {
                if (error instanceof Error &&
                    'code' in error &&
                    error.code === 11000) {
                    throw new Error('A client with this email already exists');
                }
                throw error;
            }
        });
    }
    updateClient(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid client id');
            }
            const client = yield client_model_1.Client.findById(id);
            if (!client) {
                throw new Error('Client not found');
            }
            if (input.companyName !== undefined) {
                if (!input.companyName.trim()) {
                    throw new Error('Company name is required');
                }
                client.companyName = input.companyName.trim();
            }
            if (input.contactName !== undefined) {
                client.contactName = input.contactName.trim() || undefined;
            }
            if (input.email !== undefined) {
                if (!input.email.trim()) {
                    throw new Error('Email is required');
                }
                client.email = input.email.trim().toLowerCase();
            }
            if (input.phone !== undefined) {
                client.phone = input.phone.trim() || undefined;
            }
            if (input.status !== undefined) {
                client.status = input.status;
            }
            if (input.notes !== undefined) {
                client.notes = input.notes.trim() || undefined;
            }
            try {
                yield client.save();
                return (0, client_mapper_1.toIClient)(client);
            }
            catch (error) {
                if (error instanceof Error &&
                    'code' in error &&
                    error.code === 11000) {
                    throw new Error('A client with this email already exists');
                }
                throw error;
            }
        });
    }
    deleteClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid client id');
            }
            const client = yield client_model_1.Client.findById(id);
            if (!client) {
                throw new Error('Client not found');
            }
            const clientObjectId = client._id;
            yield Promise.all([
                user_model_1.User.deleteMany({ clientId: clientObjectId }),
                api_model_1.Api.deleteMany({ clientId: clientObjectId }),
                project_model_1.Project.deleteMany({ clientId: clientObjectId }),
            ]);
            yield client_model_1.Client.findByIdAndDelete(id);
        });
    }
}
exports.ClientService = ClientService;
