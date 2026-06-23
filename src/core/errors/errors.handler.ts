import { Response } from 'express';
import { DomainError } from './domain.error';
import { RepositoryNotFoundError } from './repository-not-found.error';
import { HTTP_STATUSES } from '../utils/http-status';

export function errorsHandler(error: unknown, res: Response): Response {
  if (
    error instanceof RepositoryNotFoundError ||
    (error instanceof Error && error.name === 'RepositoryNotFoundError')
  ) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }

  if (
    error instanceof DomainError ||
    (error instanceof Error && error.name === 'DomainError')
  ) {
    const domainError = error as DomainError;

    return res.status(domainError.statusCode).json({
      errorsMessages: [
        {
          field: domainError.field,
          message: domainError.message,
        },
      ],
    });
  }

  console.error(error);

  return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
}