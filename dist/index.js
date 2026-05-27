"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("./db/connection"));
const registerRoutes_1 = require("./routes/registerRoutes");
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
app.use((req, res, next) => {
    var _a;
    res.header('Access-Control-Allow-Origin', (_a = process.env.CLIENT_ORIGIN) !== null && _a !== void 0 ? _a : '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, auth-token');
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
    }
    next();
});
app.use(express_1.default.json());
(0, registerRoutes_1.registerRoutes)(app);
(0, connection_1.default)().then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});
