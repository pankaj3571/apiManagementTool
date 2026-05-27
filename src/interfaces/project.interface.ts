export type ProjectStatus = 'active' | 'archived';

export interface ICreateProject {
  name: string;
  description?: string;
  clientId: string;
  status?: ProjectStatus;
}

export interface IProject {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  createdBy: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}
