import { authService } from '../services/auth.service';
import { userRepository } from '../repositories/user.repository';
import bcrypt from 'bcryptjs';

jest.mock('../repositories/user.repository');

const mockedRepo = userRepository as jest.Mocked<typeof userRepository>;

describe('AuthService', () => {

    beforeEach(() => jest.clearAllMocks());


    describe('register', () => {
        it('registra un usuario nuevo correctamente', async () => {
            mockedRepo.findByEmail.mockResolvedValue(null);
            mockedRepo.create.mockResolvedValue({
                id: 1, name: 'Juan', email: 'juan@test.com',
                password: 'hashed', role: 'user',
                created_at: new Date(), updated_at: new Date(),
            });

            const result = await authService.register({
                name: 'Juan',
                email: 'juan@test.com',
                password: 'password123',
            });

            expect(result.message).toBe('Usuario registrado exitosamente');
            expect(mockedRepo.create).toHaveBeenCalledTimes(1);
        });

        it('lanza error 409 si el email ya existe', async () => {
            mockedRepo.findByEmail.mockResolvedValue({
                id: 1, name: 'Juan', email: 'juan@test.com',
                password: 'hashed', role: 'user',
                created_at: new Date(), updated_at: new Date(),
            });

            await expect(
                authService.register({ name: 'Juan', email: 'juan@test.com', password: 'password123' })
            ).rejects.toMatchObject({ status: 409, message: 'El email ya está registrado' });
        });
    });


    describe('login', () => {
        it('retorna token y usuario sin password al hacer login correcto', async () => {
            const hashed = await bcrypt.hash('password123', 10);
            mockedRepo.findByEmail.mockResolvedValue({
                id: 1, name: 'Juan', email: 'juan@test.com',
                password: hashed, role: 'user',
                created_at: new Date(), updated_at: new Date(),
            });

            const result = await authService.login({
                email: 'juan@test.com',
                password: 'password123',
            });

            expect(result.token).toBeDefined();
            expect(result.user).not.toHaveProperty('password');
            expect(result.user.email).toBe('juan@test.com');
        });

        it('lanza error 401 si el usuario no existe', async () => {
            mockedRepo.findByEmail.mockResolvedValue(null);

            await expect(
                authService.login({ email: 'noexiste@test.com', password: 'password123' })
            ).rejects.toMatchObject({ status: 401, message: 'Credenciales inválidas' });
        });

        it('lanza error 401 si el password es incorrecto', async () => {
            const hashed = await bcrypt.hash('password123', 10);
            mockedRepo.findByEmail.mockResolvedValue({
                id: 1, name: 'Juan', email: 'juan@test.com',
                password: hashed, role: 'user',
                created_at: new Date(), updated_at: new Date(),
            });

            await expect(
                authService.login({ email: 'juan@test.com', password: 'wrongpassword' })
            ).rejects.toMatchObject({ status: 401, message: 'Credenciales inválidas' });
        });
    });
});