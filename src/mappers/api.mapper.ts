import { IApi, IApiField, IApiFileField, IApiParam, IApiTestResponse } from '../interfaces/api.interface';
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
    projectId: doc.projectId?.toString(),
    clientId: doc.clientId?.toString(),
    bodyType: doc.bodyType || 'json',
    pathParams: (doc.pathParams ?? []) as IApiParam[],
    queryParams: (doc.queryParams ?? []) as IApiParam[],
    bearerToken: doc.bearerToken || undefined,
    fields: (doc.fields ?? []) as IApiField[],
    fileFields: (doc.fileFields ?? []) as IApiFileField[],
    lastTestResponse: doc.lastTestResponse
      ? ({
          success: doc.lastTestResponse.success ?? false,
          statusCode: doc.lastTestResponse.statusCode ?? undefined,
          statusText: doc.lastTestResponse.statusText || undefined,
          responseBody: doc.lastTestResponse.responseBody || undefined,
          responseHeaders: (doc.lastTestResponse.responseHeaders as Record<string, string>) || undefined,
          durationMs: doc.lastTestResponse.durationMs ?? 0,
          testedAt: doc.lastTestResponse.testedAt || new Date(),
          requestUrl: doc.lastTestResponse.requestUrl || '',
          errorMessage: doc.lastTestResponse.errorMessage || undefined,
        } satisfies IApiTestResponse)
      : undefined,
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date(),
  };
}
