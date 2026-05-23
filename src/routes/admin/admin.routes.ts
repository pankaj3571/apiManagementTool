import { Router } from 'express';
import adminController from '../../controllers/admin/admin.controller';

const router = Router();

router.post('/create', adminController.createAdmin);
router.get('/:id', adminController.getAdmin);
export default router;
