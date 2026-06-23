import { bcryptService } from '../adapters/bcrypt.service';
import { usersRepository } from '../../features/users/infrastructure/users.repository';
import { LoginInput } from '../api/input/login-create';

export const authService = {
  async checkCredentials(dto: LoginInput): Promise<{ accessToken: string } | null> {
    const { loginOrEmail, password } = dto;
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }
    if (user) {
      const isPasswordCorrect = await bcryptService.checkPassword(password, user.passwordHash);
      if (!isPasswordCorrect) {
        return null;
      }
    }
    return { accessToken: 'token' };
  },
};
