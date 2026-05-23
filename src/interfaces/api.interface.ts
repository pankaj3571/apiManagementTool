export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ApiStatus = 'active' | 'inactive' | 'deprecated';

export interface ICreateApi {
  name: string;
  endpoint: string;
  method: ApiMethod;
  description?: string;
  version?: string;
  status?: ApiStatus;
  baseUrl?: string;
  tags?: string[];
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
  createdAt: Date;
  updatedAt: Date;
}
