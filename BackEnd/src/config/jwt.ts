import { SignOptions } from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido');
}

interface JwtConfig {
    secret: string;
    expiresIn: SignOptions['expiresIn'];
}

export const jwtConfig: JwtConfig = {
    secret: process.env.JWT_SECRET,
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'],
};