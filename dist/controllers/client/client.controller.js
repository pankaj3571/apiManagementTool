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
const client_service_1 = require("../../services/client.service");
class ClientController {
    constructor(clientService) {
        this.clientService = clientService;
        this.listClients = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const clients = yield this.clientService.listClients();
                res.status(200).json(clients);
            }
            catch (_a) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.getClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const client = yield this.clientService.getClient(id);
                res.status(200).json(client);
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
        this.createClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const payload = (_a = req.body.client) !== null && _a !== void 0 ? _a : req.body;
                const newClient = yield this.clientService.createClient(payload);
                res.status(201).json(newClient);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Company name and email are required') {
                    res.status(400).json({ message: error.message });
                    return;
                }
                if (error instanceof Error && error.message === 'A client with this email already exists') {
                    res.status(409).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.updateClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const payload = (_a = req.body.client) !== null && _a !== void 0 ? _a : req.body;
                const client = yield this.clientService.updateClient(id, payload);
                res.status(200).json(client);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Client not found') {
                    res.status(404).json({ message: error.message });
                    return;
                }
                if (error instanceof Error &&
                    (error.message === 'Invalid client id' ||
                        error.message === 'Company name is required' ||
                        error.message === 'Email is required')) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                if (error instanceof Error && error.message === 'A client with this email already exists') {
                    res.status(409).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.deleteClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.clientService.deleteClient(id);
                res.status(204).send();
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
    }
}
exports.default = new ClientController(new client_service_1.ClientService());
