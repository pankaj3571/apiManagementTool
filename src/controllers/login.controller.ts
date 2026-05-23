import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
class LoginController {
  constructor(private readonly userService: UserService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      const user = await this.userService.login(email, password);
      res.status(200).json({data:user,status:200,message:'Login successful'});
    } catch (error) {
        console.log('error', error);
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof Error && error.message === 'Invalid password') {
        res.status(401).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new LoginController(new UserService());