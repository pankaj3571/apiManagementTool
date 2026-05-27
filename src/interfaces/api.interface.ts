export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ApiStatus = 'active' | 'inactive' | 'deprecated';
export type ApiBodyType = 'json' | 'multipart' | 'form-data' | 'none';

export type ApiFieldType = 'string' | 'number' | 'boolean' | 'email' | 'text' | 'date';

export interface IApiField {
  name: string;
  type: ApiFieldType;
  required?: boolean;
  description?: string;
  defaultValue?: string;
}

export interface IApiFileField {
  name: string;
  required?: boolean;
  accept?: string;
  maxSizeMb?: number;
  description?: string;
}

export interface IApiParam {
  name: string;
  value?: string;
}

export interface IApiTestResponse {
  success: boolean;
  statusCode?: number;
  statusText?: string;
  responseBody?: string;
  responseHeaders?: Record<string, string>;
  durationMs: number;
  testedAt: Date;
  requestUrl: string;
  errorMessage?: string;
}

export interface ICreateApi {
  name: string;
  endpoint: string;
  method: ApiMethod;
  description?: string;
  version?: string;
  status?: ApiStatus;
  baseUrl?: string;
  tags?: string[];
  projectId?: string;
  clientId?: string;
  bodyType?: ApiBodyType;
  pathParams?: IApiParam[];
  queryParams?: IApiParam[];
  bearerToken?: string;
  fields?: IApiField[];
  fileFields?: IApiFileField[];
}

export interface IApi {
  id: string;
  name: string;
  endpoint: string;
  method: ApiMethod;
  description?: string;
  version: string;
  status: ApiStatus;
  baseUrl?: string;
  tags: string[];
  projectId?: string;
  clientId?: string;
  bodyType: ApiBodyType;
  pathParams: IApiParam[];
  queryParams: IApiParam[];
  bearerToken?: string;
  fields: IApiField[];
  fileFields: IApiFileField[];
  lastTestResponse?: IApiTestResponse;
  createdAt: Date;
  updatedAt: Date;
}
