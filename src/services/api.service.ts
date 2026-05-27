import { Types } from 'mongoose';
import { IApi, ICreateApi } from '../interfaces/api.interface';
import { toIApi } from '../mappers/api.mapper';
import { Api, ApiDocument } from '../models/api.model';
import { Project } from '../models/project.model';
import { testApiDefinition } from './apiTest.service';

export class ApiService {
  private async attachTestResponse(
    apiId: Types.ObjectId,
    config: {
      method: ICreateApi['method'];
      endpoint: string;
      baseUrl?: string;
      bodyType?: ICreateApi['bodyType'];
      pathParams?: ICreateApi['pathParams'];
      queryParams?: ICreateApi['queryParams'];
      bearerToken?: string;
      fields?: ICreateApi['fields'];
      fileFields?: ICreateApi['fileFields'];
    }
  ): Promise<IApi> {
    const testResult = await testApiDefinition({
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

    const updated = await Api.findByIdAndUpdate(
      apiId,
      { lastTestResponse: testResult },
      { new: true }
    );

    if (!updated) {
      throw new Error('API not found');
    }

    return toIApi(updated as unknown as ApiDocument);
  }

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

  async listByProject(projectId: string, clientId: string): Promise<IApi[]> {
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(clientId)) {
      throw new Error('Invalid project or client id');
    }

    const project = await Project.findOne({ _id: projectId, clientId });
    if (!project) {
      throw new Error('Project not found');
    }

    const apis = await Api.find({ projectId, clientId }).sort({ createdAt: -1 });
    return apis.map((a) => toIApi(a as unknown as ApiDocument));
  }

  async createApi(input: ICreateApi): Promise<IApi> {
    if (!input?.name?.trim() || !input?.endpoint?.trim() || !input?.method) {
      throw new Error('Name, endpoint, and method are required');
    }

    if (input.projectId && input.clientId) {
      if (!Types.ObjectId.isValid(input.projectId) || !Types.ObjectId.isValid(input.clientId)) {
        throw new Error('Invalid project or client id');
      }
      const project = await Project.findOne({ _id: input.projectId, clientId: input.clientId });
      if (!project) {
        throw new Error('Project not found');
      }
    }

    const newApi = await Api.create({
      ...input,
      name: input.name.trim(),
      endpoint: input.endpoint.trim(),
      tags: input.tags?.filter(Boolean) ?? [],
      pathParams: input.pathParams?.filter((p) => p.name?.trim()) ?? [],
      queryParams: input.queryParams?.filter((p) => p.name?.trim()) ?? [],
      bearerToken: input.bearerToken?.trim(),
      fields: input.fields?.filter((f) => f.name?.trim()) ?? [],
      fileFields: input.fileFields?.filter((f) => f.name?.trim()) ?? [],
    });

    return this.attachTestResponse(newApi._id, {
      method: input.method,
      endpoint: input.endpoint.trim(),
      baseUrl: input.baseUrl?.trim(),
      bodyType: input.bodyType,
      pathParams: input.pathParams,
      queryParams: input.queryParams,
      bearerToken: input.bearerToken?.trim(),
      fields: input.fields,
      fileFields: input.fileFields,
    });
  }

  private async findProjectApi(apiId: string, projectId: string, clientId: string): Promise<ApiDocument> {
    if (!Types.ObjectId.isValid(apiId) || !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(clientId)) {
      throw new Error('Invalid api, project, or client id');
    }

    const project = await Project.findOne({ _id: projectId, clientId });
    if (!project) {
      throw new Error('Project not found');
    }

    const api = await Api.findOne({ _id: apiId, projectId, clientId });
    if (!api) {
      throw new Error('API not found');
    }

    return api as unknown as ApiDocument;
  }

  async updateApi(
    apiId: string,
    projectId: string,
    clientId: string,
    input: ICreateApi
  ): Promise<IApi> {
    if (!input?.name?.trim() || !input?.endpoint?.trim() || !input?.method) {
      throw new Error('Name, endpoint, and method are required');
    }

    await this.findProjectApi(apiId, projectId, clientId);

    const updated = await Api.findOneAndUpdate(
      { _id: apiId, projectId, clientId },
      {
        name: input.name.trim(),
        endpoint: input.endpoint.trim(),
        method: input.method,
        description: input.description?.trim(),
        version: input.version?.trim(),
        status: input.status,
        baseUrl: input.baseUrl?.trim(),
        bodyType: input.bodyType,
        pathParams: input.pathParams?.filter((p) => p.name?.trim()) ?? [],
        queryParams: input.queryParams?.filter((p) => p.name?.trim()) ?? [],
        bearerToken: input.bearerToken?.trim(),
        fields: input.fields?.filter((f) => f.name?.trim()) ?? [],
        fileFields: input.fileFields?.filter((f) => f.name?.trim()) ?? [],
        ...(input.tags ? { tags: input.tags.filter(Boolean) } : {}),
      },
      { new: true }
    );

    if (!updated) {
      throw new Error('API not found');
    }

    return this.attachTestResponse(updated._id, {
      method: input.method,
      endpoint: input.endpoint.trim(),
      baseUrl: input.baseUrl?.trim(),
      bodyType: input.bodyType,
      pathParams: input.pathParams,
      queryParams: input.queryParams,
      bearerToken: input.bearerToken?.trim(),
      fields: input.fields,
      fileFields: input.fileFields,
    });
  }

  async deleteApi(apiId: string, projectId: string, clientId: string): Promise<void> {
    const api = await this.findProjectApi(apiId, projectId, clientId);
    await Api.deleteOne({ _id: api._id });
  }
}
