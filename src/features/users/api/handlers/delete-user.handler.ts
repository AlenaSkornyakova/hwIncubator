import { RequestWithParams } from '../../../../core/types/request-types.types';
import { usersService } from '../../application/users.service';
import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { errorsHandler } from '../../../../core/errors/errors.handler';


export const deleteUserHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response<string>,
) => {
  try {
    const id = req.params.id;
    await usersService.delete(id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (error) {
    console.error('Delete user failed:', error);
    return errorsHandler(error, res);
  }
};
