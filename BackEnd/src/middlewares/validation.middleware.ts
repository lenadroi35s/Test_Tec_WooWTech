import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Error de validación',
      errors: errors.array().map((e) => ({
        field: e.type === 'field' ? e.path : 'unknown',
        message: e.msg,
      })),
    });
    return;
  }
  next();
};

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
];

export const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),
];