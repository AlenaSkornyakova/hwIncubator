import { Response } from 'express';
import { RequestWithBody } from '../../../core/types/request-types.types';
import { HTTP_STATUSES } from '../../../core/utils/http-status';
import { authService } from '../../application/auth.service';
import { LoginInput } from '../input/login-create';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { matchedData } from 'express-validator/lib/matched-data';


export const loginHandler = async (req: RequestWithBody<LoginInput>, res: Response) => {
 try {
     const sanitizedInput = matchedData<LoginInput>(req, {
       locations: ['body'],
       includeOptionals: true,
     });
    const dto: LoginInput = {
      loginOrEmail: sanitizedInput.loginOrEmail,
      password: sanitizedInput.password,
    };
    const accessToken = await authService.checkCredentials(dto);
    if (!accessToken) {
      return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (error) {
    console.error('Login failed:', error);
    return errorsHandler(error, res);
  }
};
