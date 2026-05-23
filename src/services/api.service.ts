import { Types } from 'mongoose';
import { IApi, ICreateApi } from '../interfaces/api.interface';
import { toIApi } from '../mappers/api.mapper';
import { Api, ApiDocument } from '../models/api.model';

export class ApiService {
  async getApi(id: string): Promise<IApi> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid api id');
    }

    const api = await Api.findById(id);
    if (!api) {
      throw new Error('API not found');
    }

    return toIApi(api as unknown as ApiDocument);
  }

  async createApi(input: ICreateApi): Promise<IApi> {
    if (!input?.name?.trim() || !input?.endpoint?.trim() || !input?.method) {
      throw new Error('Name, endpoint, and method are required');
    }

    const newApi = await Api.create({
      ...input,
      name: input.name.trim(),
      endpoint: input.endpoint.trim(),
      tags: input.tags?.filter(Boolean) ?? [],
    });

    return toIApi(newApi as unknown as ApiDocument);
  }
}
