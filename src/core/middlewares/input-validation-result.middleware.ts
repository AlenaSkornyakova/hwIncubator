import { validationResult, type FieldValidationError, type ValidationError } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { type FieldErrorType, type APIErrorResultType} from '../types/validation-error.types';
import { HTTP_STATUSES } from '../utils/http-status'


const mapValidationErrorToFieldError = (error: ValidationError): FieldErrorType => {
  const expressError = error as FieldValidationError;
  return { 
    field: String(expressError.path), 
    message: String(expressError.msg) };
};

const sendValidationError = (res: Response, errorsMessages: FieldErrorType[]) => {
  const body: APIErrorResultType = { errorsMessages };
  return res.status(HTTP_STATUSES.BAD_REQUEST_400).json(body);
};

export const inputValidationResultMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction) => {
    
  const errorsMessages = validationResult(req)
    .formatWith(mapValidationErrorToFieldError)
    .array({ onlyFirstError: true });

  if (errorsMessages.length) return sendValidationError(res, errorsMessages);

  next();
};