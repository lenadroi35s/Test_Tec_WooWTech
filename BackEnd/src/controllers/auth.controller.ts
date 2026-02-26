import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDTO, LoginDTO } from '../models/user.model';

export class AuthController {

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: RegisterDTO = req.body;
      const result = await authService.register(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginDTO = req.body;
      const result = await authService.login(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();