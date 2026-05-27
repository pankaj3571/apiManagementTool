import { Router } from 'express';
import loginController from '../controllers/login.controller';

const router = Router();

router.post('/login', loginController.login);
router.post('/refresh', loginController.refresh);

export default router;