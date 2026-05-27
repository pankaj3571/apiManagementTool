import { Router } from 'express';
import clientController from '../../controllers/client/client.controller';
import clientUserController from '../../controllers/client/clientUser.controller';
import projectController from '../../controllers/client/project.controller';
import projectApiController from '../../controllers/client/projectApi.controller';
import {
  authenticate,
  authorize,
  requireClientScope,
  requirePermission,
} from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

const portalRoles = ['admin', 'client', 'user'] as const;
const manageRoles = ['admin', 'client'] as const;

/** Admin-only: manage all clients */
router.get('/', authorize('admin'), clientController.listClients);
router.post('/create', authorize('admin'), clientController.createClient);
router.get(
  '/:id',
  authorize(...portalRoles),
  requireClientScope('id'),
  clientController.getClient
);
router.put(
  '/:id',
  authorize('admin', 'client'),
  requireClientScope('id'),
  clientController.updateClient
);
router.delete('/:id', authorize('admin'), clientController.deleteClient);

/** Admin or client org admin: manage team users */
router.get(
  '/:clientId/users',
  authorize(...manageRoles),
  requireClientScope('clientId'),
  clientUserController.listUsers
);
router.post(
  '/:clientId/users',
  authorize(...manageRoles),
  requireClientScope('clientId'),
  clientUserController.createUser
);
router.put(
  '/:clientId/users/:userId',
  authorize(...manageRoles),
  requireClientScope('clientId'),
  clientUserController.updateUser
);
router.delete(
  '/:clientId/users/:userId',
  authorize(...manageRoles),
  requireClientScope('clientId'),
  clientUserController.deleteUser
);

router.get(
  '/:clientId/projects',
  authorize(...portalRoles),
  requireClientScope('clientId'),
  projectController.listProjects
);
router.post(
  '/:clientId/projects',
  authorize(...portalRoles),
  requireClientScope('clientId'),
  requirePermission('canCreateProjects'),
  projectController.createProject
);
router.get(
  '/:clientId/projects/:projectId',
  authorize(...portalRoles),
  requireClientScope('clientId'),
  projectApiController.getProject
);
router.get(
  '/:clientId/projects/:projectId/apis',
  authorize(...portalRoles),
  requireClientScope('clientId'),
  projectApiController.listApis
);
router.post(
  '/:clientId/projects/:projectId/apis',
  authorize(...portalRoles),
  requireClientScope('clientId'),
  requirePermission('canCreateApis'),
  projectApiController.createApi
);
router.put(
  '/:clientId/projects/:projectId/apis/:apiId',
  authorize(...manageRoles),
  requireClientScope('clientId'),
  projectApiController.updateApi
);
router.delete(
  '/:clientId/projects/:projectId/apis/:apiId',
  authorize(...manageRoles),
  requireClientScope('clientId'),
  projectApiController.deleteApi
);

export default router;
