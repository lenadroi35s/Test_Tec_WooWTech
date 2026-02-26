import { Request, Response, NextFunction } from 'express';

interface AppError {
  status?: number;
  message?: string;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  console.error('Error:', err);
  res.status(status).json({ message });
};
