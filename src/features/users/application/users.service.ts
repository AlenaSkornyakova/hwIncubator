import { UserCreateInput } from '../api/input/user-create.input';
import { User } from '../domain/user.type';
import { usersRepository } from '../infrastructure/users.repository';
import { bcryptService } from '../../../auth/adapters/bcrypt.service';
import { DomainError } from '../../../core/errors/domain.error';

export const usersService = {
  async create(dto: UserCreateInput): Promise<string> {
    const { login, email, password } = dto;

    const existingUserByLogin = await usersRepository.findByLoginOrEmail(login);
    if (existingUserByLogin) {
      throw new DomainError('Login already exists', 'LOGIN_ALREADY_EXISTS', 'login', 400);
    }

    const existingUserByEmail = await usersRepository.findByLoginOrEmail(email);
    if (existingUserByEmail) {
      throw new DomainError('Email already exists', 'EMAIL_ALREADY_EXISTS', 'email', 400);
    }

    const passwordHash = await bcryptService.generateHash(password);

    const newUser: User = {
      login,
      email,
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
