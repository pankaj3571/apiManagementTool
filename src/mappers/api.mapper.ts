import { IApi } from '../interfaces/api.interface';
import { ApiDocument } from '../models/api.model';

export function toIApi(doc: ApiDocument): IApi {
  return {
    id: doc._id.toString(),
    name: doc.name,
    endpoint: doc.endpoint,
    method: doc.method,
    description: doc.description || undefined,
    version: doc.version || 'v1',
    status: doc.status || 'active',
    baseUrl: doc.baseUrl || undefined,
    tags: doc.tags ?? [],
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date(),
  };
}
