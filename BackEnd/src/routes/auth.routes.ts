import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import {
    registerValidation,
    loginValidation,
    validate,
} from '../middlewares/validation.middleware';

const router = Router();

router.post(
    '/register',
    registerValidation,
    validate,
    authController.register
);

router.post(
    '/login',
    loginValidation,
    validate,
    authController.login
);
export default router;