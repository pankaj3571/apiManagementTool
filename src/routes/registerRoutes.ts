import fs from 'fs';
import path from 'path';
import { Express, Router } from 'express';

/**
 * Folder name becomes the first URL segment.
 * File `user.routes.ts` in `admin/` mounts at `/admin/user`.
 * File `admin.routes.ts` or `index.routes.ts` in `admin/` mounts at `/admin`.
 */
function resolveRouteSegment(folder: string, fileName: string): string {
  const baseName = fileName.replace(/\.routes\.(ts|js)$/, '');
  if (baseName === 'index' || baseName === folder) {
    return '';
  }
  return `/${baseName}`;
}

export function registerRoutes(app: Express): void {
  const routesDir = __dirname;

  const rootRouteFiles = fs
    .readdirSync(routesDir)
    .filter((file) => /\.routes\.(ts|js)$/.test(file));

  for (const file of rootRouteFiles) {
    const modulePath = path.join(routesDir, file.replace(/\.ts$/, ''));
    const routeModule = require(modulePath) as { default: Router };
    app.use('/', routeModule.default);
    console.log(`Routes mounted at / (${file})`);
  }

  const folders = fs
    .readdirSync(routesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const { name: folder } of folders) {
    const folderPath = path.join(routesDir, folder);
    const routeFiles = fs
      .readdirSync(folderPath)
      .filter((file) => /\.routes\.(ts|js)$/.test(file));

    for (const file of routeFiles) {
      const segment = resolveRouteSegment(folder, file);
      const mountPath = `/${folder}${segment}`;
      const modulePath = path.join(folderPath, file.replace(/\.ts$/, ''));
      const routeModule = require(modulePath) as { default: Router };

      app.use(mountPath, routeModule.default);
      console.log(`Routes mounted at ${mountPath}`);
    }
  }
}
