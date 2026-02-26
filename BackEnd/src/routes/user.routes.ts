import { Router, Request, Response, NextFunction } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { updateProfileValidation, validate } from '../middlewares/validation.middleware';

const router = Router();

router.get(
    '/me',
    authenticate,
    (req: Request, res: Response, next: NextFunction) =>
        userController.getMe(req as any, res, next)
);

router.put(
    '/me',
    authenticate,
    updateProfileValidation,
    validate,
    (req: Request, res: Response, next: NextFunction) =>
        userController.updateMe(req as any, res, next)
);

router.get(
    '/',
    authenticate,
    requireRole('admin'),
    (req: Request, res: Response, next: NextFunction) =>
        userController.getAll(req as any, res, next)
);

export default router;