import { Request, Response } from 'express';
import { ICreateApi } from '../../interfaces/api.interface';
import { ApiService } from '../../services/api.service';
import { ProjectService } from '../../services/project.service';

class ProjectApiController {
  constructor(
    private readonly apiService: ApiService,
    private readonly projectService: ProjectService
  ) {}

  getProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = String(req.params.clientId ?? '');
      const projectId = String(req.params.projectId ?? '');
      const project = await this.projectService.getProject(projectId, clientId);
      res.status(200).json(project);
    } catch (error) {
      if (error instanceof Error && error.message === 'Project not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'Invalid project or client id') {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  listApis = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = String(req.params.clientId ?? '');
      const projectId = String(req.params.projectId ?? '');
      const apis = await this.apiService.listByProject(projectId, clientId);
      res.status(200).json(apis);
    } catch (error) {
      if (error instanceof Error && error.message === 'Project not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'Invalid project or client id') {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  createApi = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = String(req.params.clientId ?? '');
      const projectId = String(req.params.projectId ?? '');
      const body = req.body.api ?? req.body;
      const payload: ICreateApi = {
        ...body,
        clientId,
        projectId,
      };
      const api = await this.apiService.createApi(payload);
      res.status(201).json(api);
    } catch (error) {
      if (error instanceof Error && error.message === 'Name, endpoint, and method are required') {
        res.status(400).json({ message: error.message });
        return;
      }
      if (
        error instanceof Error &&
        (error.message === 'Project not found' || error.message === 'Invalid project or client id')
      ) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateApi = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = String(req.params.clientId ?? '');
      const projectId = String(req.params.projectId ?? '');
      const apiId = String(req.params.apiId ?? '');
      const body = req.body.api ?? req.body;
      const payload: ICreateApi = { ...body, clientId, projectId };
      const api = await this.apiService.updateApi(apiId, projectId, clientId, payload);
      res.status(200).json(api);
    } catch (error) {
      if (error instanceof Error && error.message === 'Name, endpoint, and method are required') {
        res.status(400).json({ message: error.message });
        return;
      }
      if (
        error instanceof Error &&
        (error.message === 'API not found' ||
          error.message === 'Project not found' ||
          error.message === 'Invalid api, project, or client id')
      ) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  deleteApi = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = String(req.params.clientId ?? '');
      const projectId = String(req.params.projectId ?? '');
      const apiId = String(req.params.apiId ?? '');
      await this.apiService.deleteApi(apiId, projectId, clientId);
      res.status(204).send();
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'API not found' ||
          error.message === 'Project not found' ||
          error.message === 'Invalid api, project, or client id')
      ) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export default new ProjectApiController(new ApiService(), new ProjectService());
