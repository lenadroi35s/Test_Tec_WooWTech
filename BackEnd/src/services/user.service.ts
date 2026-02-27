import { userRepository } from '../repositories/user.repository';
import { UpdateProfileDTO, UserPublic } from '../models/user.model';

export class UserService {

  async getProfile(userId: number): Promise<UserPublic> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw { status: 404, message: 'Usuario no encontrado' };
    }
    const { password: _, ...userPublic } = user;
    return userPublic;
  }

  async updateProfile(
    userId: number,
    data: UpdateProfileDTO
  ): Promise<{ message: string; user: UserPublic }> {
    const user = await userRepository.update(userId, data);
    if (!user) {
      throw { status: 404, message: 'Usuario no encontrado' };
    }
    const { password: _, ...userPublic } = user;
    return { message: 'Perfil actualizado', user: userPublic };
  }

  async getAllUsers(
    page = 1,
    limit = 20,
    search = ''
  ): Promise<{ users: UserPublic[]; total: number; page: number; totalPages: number }> {
    const offset = (page - 1) * limit;
    const { users, total } = await userRepository.findAll(limit, offset, search);

    const usersPublic = users.map(({ password: _, ...u }) => u);

    return {
      users: usersPublic,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const userService = new UserService();