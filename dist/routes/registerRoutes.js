"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Folder name becomes the first URL segment.
 * File `user.routes.ts` in `admin/` mounts at `/admin/user`.
 * File `admin.routes.ts` or `index.routes.ts` in `admin/` mounts at `/admin`.
 */
function resolveRouteSegment(folder, fileName) {
    const baseName = fileName.replace(/\.routes\.(ts|js)$/, '');
    if (baseName === 'index' || baseName === folder) {
        return '';
    }
    return `/${baseName}`;
}
function registerRoutes(app) {
    const routesDir = __dirname;
    const rootRouteFiles = fs_1.default
        .readdirSync(routesDir)
        .filter((file) => /\.routes\.(ts|js)$/.test(file));
    for (const file of rootRouteFiles) {
        const modulePath = path_1.default.join(routesDir, file.replace(/\.ts$/, ''));
        const routeModule = require(modulePath);
        app.use('/', routeModule.default);
        console.log(`Routes mounted at / (${file})`);
    }
    const folders = fs_1.default
        .readdirSync(routesDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory());
    for (const { name: folder } of folders) {
        const folderPath = path_1.default.join(routesDir, folder);
        const routeFiles = fs_1.default
            .readdirSync(folderPath)
            .filter((file) => /\.routes\.(ts|js)$/.test(file));
        for (const file of routeFiles) {
            const segment = resolveRouteSegment(folder, file);
            const mountPath = `/${folder}${segment}`;
            const modulePath = path_1.default.join(folderPath, file.replace(/\.ts$/, ''));
            const routeModule = require(modulePath);
            app.use(mountPath, routeModule.default);
            console.log(`Routes mounted at ${mountPath}`);
        }
    }
}
