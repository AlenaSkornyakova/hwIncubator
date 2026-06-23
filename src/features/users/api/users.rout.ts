import express from 'express';
import { inputValidationResultMiddleware } from '../../../core/middlewares/input-validation-result.middleware';
import { paramsIdValidation } from '../../../core/middlewares/params-id.validation.middleware';
import { superAdminGuardMiddleware } from '../../../auth/api/middlewares/super-admin.guard-middleware';
import { paginationAndSortingValidation } from '../../../core/middlewares/query-pagination-sorting.validation-middleware';
import { userSortFields } from './input/users-sort-fields';
import { getUsersListHandler } from './handlers/get-users-list.handler';
import { userCreateInputValidation } from './middlewares/user-input-validation.middleware';
import { createUserHandler } from './handlers/create-user.handler';
import { deleteUserHandler } from './handlers/delete-user.handler';
import { userQueryValidation } from '../../posts/api/middlewares/user-query-validation.middleware';

export const usersRouter = express.Router();

usersRouter
  .get(
    '/',
    superAdminGuardMiddleware,
    paginationAndSortingValidation(userSortFields),
    userQueryValidation,
    inputValidationResultMiddleware,
    getUsersListHandler,
  )
  .post(
    '/',
    superAdminGuardMiddleware,
    userCreateInputValidation,
    inputValidationResultMiddleware,
    createUserHandler,
  )

  .delete(
    '/:id',
    superAdminGuardMiddleware,
    paramsIdValidation,
    inputValidationResultMiddleware,
    deleteUserHandler,
  );
