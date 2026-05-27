import { IProject } from '../interfaces/project.interface';
import { ProjectDocument } from '../models/project.model';

export function toIProject(doc: ProjectDocument): IProject {
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description || undefined,
    clientId: doc.clientId.toString(),
    createdBy: doc.createdBy.toString(),
    status: doc.status || 'active',
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date(),
  };
}
