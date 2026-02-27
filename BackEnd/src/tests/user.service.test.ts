import { userService } from '../services/user.service';
import { userRepository } from '../repositories/user.repository';

jest.mock('../repositories/user.repository');

const mockedRepo = userRepository as jest.Mocked<typeof userRepository>;

const mockUser = {
    id: 1, name: 'Juan', email: 'juan@test.com',
    password: 'hashed', role: 'user' as const,
    created_at: new Date(), updated_at: new Date(),
};

describe('UserService', () => {

    beforeEach(() => jest.clearAllMocks());

    describe('getProfile', () => {
        it('retorna el usuario sin password', async () => {
            mockedRepo.findById.mockResolvedValue(mockUser);

            const result = await userService.getProfile(1);

            expect(result).not.toHaveProperty('password');
            expect(result.email).toBe('juan@test.com');
        });

        it('lanza error 404 si el usuario no existe', async () => {
            mockedRepo.findById.mockResolvedValue(null);

            await expect(userService.getProfile(99))
                .rejects.toMatchObject({ status: 404, message: 'Usuario no encontrado' });
        });
    });

    describe('updateProfile', () => {
        it('actualiza el nombre y retorna el usuario sin password', async () => {
            mockedRepo.update.mockResolvedValue({ ...mockUser, name: 'Juan Actualizado' });

            const result = await userService.updateProfile(1, { name: 'Juan Actualizado' });

            expect(result.message).toBe('Perfil actualizado');
            expect(result.user.name).toBe('Juan Actualizado');
            expect(result.user).not.toHaveProperty('password');
        });
    });

    describe('getAllUsers', () => {
        it('retorna lista paginada sin passwords', async () => {
            mockedRepo.findAll.mockResolvedValue({ users: [mockUser], total: 1 });

            const result = await userService.getAllUsers(1, 20, '');

            expect(result.total).toBe(1);
            expect(result.users[0]).not.toHaveProperty('password');
            expect(result.page).toBe(1);
            expect(result.totalPages).toBe(1);
        });
    });
});