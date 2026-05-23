import { Request, Response } from 'express';
import { ICreateAdmin } from '../../interfaces/admin.interface';
import { AdminService } from '../../services/admin.service';

class AdminController {
  constructor(private readonly adminService: AdminService) {}

  getAdmin = async (req: Request, res: Response): Promise<void> => {
    try{    
      const { id } = req.params;
      const admin = await this.adminService.getAdmin(id as string);
      res.status(200).json(admin);
    } catch (error) {
      if (error instanceof Error && error.message === 'Admin not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'Invalid admin id') {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  createAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: ICreateAdmin = req.body.admin ?? req.body;
    //   console.log('payload', payload);
      const newAdmin = await this.adminService.createAdmin(payload);
      console.log('newAdmin', newAdmin);
      res.status(201).json(newAdmin);
    } catch (error) {
      if (error instanceof Error && error.message === 'Email and password are required') {
        res.status(400).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'Email already exists') {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

}

export default new AdminController(new AdminService());
