"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
require("dotenv/config");
exports.dbConfig = {
    dev: {
        url: (_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : 'mongodb://localhost:27017/',
        dbName: (_b = process.env.DB_NAME) !== null && _b !== void 0 ? _b : 'apiManagementTool',
    },
    prod: {
        url: (_c = process.env.MONGODB_URI_PROD) !== null && _c !== void 0 ? _c : '',
        dbName: (_d = process.env.DB_NAME_PROD) !== null && _d !== void 0 ? _d : '',
    },
    test: {
        url: (_e = process.env.MONGODB_URI_TEST) !== null && _e !== void 0 ? _e : '',
        dbName: (_f = process.env.DB_NAME_TEST) !== null && _f !== void 0 ? _f : '',
    },
};
