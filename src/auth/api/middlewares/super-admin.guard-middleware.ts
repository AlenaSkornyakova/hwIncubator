import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/utils/http-status';

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';

export function superAdminGuardMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return next();
    } else {
      return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }

}