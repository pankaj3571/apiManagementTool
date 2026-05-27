import { Router } from 'express';
import adminController from '../../controllers/admin/admin.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();

/** Public: bootstrap first admin */
router.post('/create', adminController.createAdmin);
router.get('/:id', authenticate, authorize('admin'), adminController.getAdmin);
export default router;
