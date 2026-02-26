import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { jwtConfig } from '../config/jwt';
import {
    RegisterDTO,
    LoginDTO,
    UserPublic,
    JwtPayload,
} from '../models/user.model';

export class AuthService {

    async register(data: RegisterDTO): Promise<{ message: string }> {
        const existing = await userRepository.findByEmail(data.email);

        if (existing) {
            throw { status: 409, message: 'El email ya está registrado' };
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);

        await userRepository.create({
            name: data.name,
            email: data.email,
            hashedPassword,
        });

        return { message: 'Usuario registrado exitosamente' };
    }

    async login(data: LoginDTO): Promise<{ token: string; user: UserPublic }> {
        const user = await userRepository.findByEmail(data.email);

        if (!user) {
            throw { status: 401, message: 'Credenciales inválidas' };
        }

        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
            throw { status: 401, message: 'Credenciales inválidas' };
        }

        const payload: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, jwtConfig.secret, {
            expiresIn: jwtConfig.expiresIn,
        });

        const { password: _, ...userPublic } = user;

        return { token, user: userPublic };
    }
}

export const authService = new AuthService();