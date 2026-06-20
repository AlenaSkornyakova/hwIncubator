import { UserCreateInput } from '../api/input/user-create.input';
import { User } from '../domain/user.type';
import { usersRepository } from '../infrastructure/users.repository';
import { bcryptService } from '../../../auth/adapters/bcrypt.service';

export const usersService = {
  
  async create(dto: UserCreateInput): Promise<string> {
    const passwordHash = await bcryptService.generateHash(dto.password);

    const newUser: User = {
      login: dto.login,
      email: dto.email,
      passwordHash,
      createdAt: new Date(),
    };
    const newUserId = await usersRepository.create(newUser);
    return newUserId;
  },

  async delete(id: string): Promise<boolean> {
    await usersRepository.findByIdOrFail(id);
    return await usersRepository.delete(id);
  },
};
