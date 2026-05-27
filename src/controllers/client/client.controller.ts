import { Request, Response } from 'express';
import { ICreateClient, IUpdateClient } from '../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';

class ClientController {
  constructor(private readonly clientService: ClientService) {}

  listClients = async (_req: Request, res: Response): Promise<void> => {
    try {
      const clients = await this.clientService.listClients();
      res.status(200).json(clients);
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getClient = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const client = await this.clientService.getClient(id as string);
      res.status(200).json(client);
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

  createClient = async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: ICreateClient = req.body.client ?? req.body;
      const newClient = await this.clientService.createClient(payload);
      res.status(201).json(newClient);
    } catch (error) {
      if (error instanceof Error && error.message === 'Company name and email are required') {
        res.status(400).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'A client with this email already exists') {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateClient = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const payload: IUpdateClient = req.body.client ?? req.body;
      const client = await this.clientService.updateClient(id as string, payload);
      res.status(200).json(client);
    } catch (error) {
      if (error instanceof Error && error.message === 'Client not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (
        error instanceof Error &&
        (error.message === 'Invalid client id' ||
          error.message === 'Company name is required' ||
          error.message === 'Email is required')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'A client with this email already exists') {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  deleteClient = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.clientService.deleteClient(id as string);
      res.status(204).send();
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
}

export default new ClientController(new ClientService());
