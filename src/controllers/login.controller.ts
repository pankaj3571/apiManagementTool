import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

class LoginController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      const { user, tokens } = await this.authService.login(email, password);
      res.status(200).json({
        data: { user, ...tokens },
        status: 200,
        message: 'Login successful',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (
        error instanceof Error &&
        (error.message === 'Invalid password' || error.message === 'Account is not active')
      ) {
        res.status(401).json({ message: error.message });
        return;
      }
      if (
        error instanceof Error &&
        (error.message === 'JWT_SECRET is not configured' ||
          error.message === 'JWT_REFRESH_SECRET is not configured')
      ) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.body.refreshToken ?? req.body.refresh_token;
      if (!refreshToken || typeof refreshToken !== 'string') {
        res.status(400).json({ message: 'Refresh token is required' });
        return;
      }

      const { user, tokens } = await this.authService.refresh(refreshToken);
      res.status(200).json({
        data: { user, ...tokens },
        status: 200,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'Invalid refresh token' ||
          error.message === 'Invalid token payload' ||
          error.name === 'JsonWebTokenError' ||
          error.name === 'TokenExpiredError')
      ) {
        res.status(401).json({ message: 'Invalid or expired refresh token' });
        return;
      }
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (
        error instanceof Error &&
        (error.message === 'JWT_SECRET is not configured' ||
          error.message === 'JWT_REFRESH_SECRET is not configured')
      ) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export default new LoginController(new AuthService());
