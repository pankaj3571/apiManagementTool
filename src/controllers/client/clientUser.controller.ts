import { Request, Response } from 'express';
import { ICreateClientUser, IUpdateClientUser } from '../../interfaces/clientUser.interface';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { ClientUserService } from '../../services/clientUser.service';

class ClientUserController {
  constructor(private readonly clientUserService: ClientUserService) {}

  listUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = String(req.params.clientId ?? '');
      const users = await this.clientUserService.listByClient(clientId);
      res.status(200).json(users);
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

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const clientId = String(req.params.clientId ?? '');
      const body = req.body.user ?? req.body;
      const payload: ICreateClientUser = {
        ...body,
        clientId,
      };
      if (authReq.user.role !== 'admin') {
        payload.role = 'user';
      }
      const user = await this.clientUserService.createClientUser(payload);
      res.status(201).json(user);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'Name, email, password, and client are required' ||
          error.message === 'Invalid client id')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'Client not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'A user with this email already exists') {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = String(req.params.clientId ?? '');
      const userId = String(req.params.userId ?? '');
      const body = req.body.user ?? req.body;
      const payload: IUpdateClientUser = body;
      const user = await this.clientUserService.updateClientUser(clientId, userId, payload);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (
        error instanceof Error &&
        (error.message === 'Invalid id' ||
          error.message === 'Name is required' ||
          error.message === 'Email is required')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'A user with this email already exists') {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const clientId = String(req.params.clientId ?? '');
      const userId = String(req.params.userId ?? '');
      if (authReq.user.userId === userId) {
        res.status(400).json({ message: 'You cannot delete your own account' });
        return;
      }
      await this.clientUserService.deleteClientUser(clientId, userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'Invalid id') {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export default new ClientUserController(new ClientUserService());
