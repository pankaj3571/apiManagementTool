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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbConfig_1 = require("../config/dbConfig");
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            switch (process.env.NODE_ENV) {
                case 'development':
                    yield mongoose_1.default.connect(dbConfig_1.dbConfig.dev.url, { dbName: dbConfig_1.dbConfig.dev.dbName });
                    break;
                case 'production':
                    yield mongoose_1.default.connect(dbConfig_1.dbConfig.prod.url, { dbName: dbConfig_1.dbConfig.prod.dbName });
                    break;
                case 'test':
                    yield mongoose_1.default.connect(dbConfig_1.dbConfig.test.url, { dbName: dbConfig_1.dbConfig.test.dbName });
                    break;
                default:
                    throw new Error('Invalid NODE_ENV');
            }
            console.log('Connecting to Mongodb', (process.env.NODE_ENV));
        }
        catch (error) {
            console.error('Error connecting to MongoDB:', error);
            process.exit(1);
        }
    });
}
exports.default = connectDB;
