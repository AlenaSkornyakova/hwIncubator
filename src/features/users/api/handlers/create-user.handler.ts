import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithBody } from '../../../../core/types/request-types.types';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { UserCreateInput } from '../input/user-create.input';
import { UserOutput } from '../output/user.output';
import { usersService } from '../../application/users.service';
import { usersQueryRepository } from '../../infrastructure/users.query.repository';
import { matchedData } from 'express-validator/lib/matched-data';

export const createUserHandler = async (
  req: RequestWithBody<UserCreateInput>,
  res: Response<UserOutput>,
) => {
  try {
    const sanitizedInput = matchedData<UserCreateInput>(req, {
      locations: ['body'],
      includeOptionals: true,
    });

      const dto: UserCreateInput = {
        login: sanitizedInput.login,
        password: sanitizedInput.password,
        email: sanitizedInput.email,
      };
    const userId = await usersService.create(dto);
    const createdUser = await usersQueryRepository.findById(userId);

    if (!createdUser) {
      throw new Error('Created user cannot be loaded after creation');
    }
    return res.status(HTTP_STATUSES.CREATED_201).send(createdUser);
    
  } catch (error) {
    console.error('Create user failed:', error);
    return errorsHandler(error, res);
  }
};
