import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { ICreateProject } from '../../interfaces/project.interface';
import { ProjectService } from '../../services/project.service';

class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  listProjects = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = String(req.params.clientId ?? '');
      const projects = await this.projectService.listByClient(clientId);
      res.status(200).json(projects);
    } catch (error) {
      if (error instanceof Error && error.message === 'Client not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'Invalid client id') {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  createProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = String(req.params.clientId ?? '');
      const body = req.body.project ?? req.body;
      const payload: ICreateProject = {
        ...body,
        clientId,
      };
      const userId = (req as AuthenticatedRequest).user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const project = await this.projectService.createProject(payload, userId);
      res.status(201).json(project);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'Project name and client are required' ||
          error.message === 'Invalid client id')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'Client not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export default new ProjectController(new ProjectService());
