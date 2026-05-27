import { Types } from 'mongoose';
import { ICreateProject, IProject } from '../interfaces/project.interface';
import { toIProject } from '../mappers/project.mapper';
import { Client } from '../models/client.model';
import { Project, ProjectDocument } from '../models/project.model';

export class ProjectService {
  async getProject(projectId: string, clientId: string): Promise<IProject> {
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(clientId)) {
      throw new Error('Invalid project or client id');
    }

    const project = await Project.findOne({ _id: projectId, clientId });
    if (!project) {
      throw new Error('Project not found');
    }

    return toIProject(project as unknown as ProjectDocument);
  }

  async listByClient(clientId: string): Promise<IProject[]> {
    if (!Types.ObjectId.isValid(clientId)) {
      throw new Error('Invalid client id');
    }

    const client = await Client.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const projects = await Project.find({ clientId }).sort({ createdAt: -1 });
    return projects.map((p) => toIProject(p as unknown as ProjectDocument));
  }

  async createProject(input: ICreateProject, createdBy: string): Promise<IProject> {
    if (!input?.name?.trim() || !input?.clientId) {
      throw new Error('Project name and client are required');
    }

    if (!Types.ObjectId.isValid(input.clientId)) {
      throw new Error('Invalid client id');
    }

    const client = await Client.findById(input.clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const newProject = await Project.create({
      name: input.name.trim(),
      description: input.description?.trim(),
      clientId: input.clientId,
      createdBy,
      status: input.status ?? 'active',
    });

    return toIProject(newProject as unknown as ProjectDocument);
  }
}
