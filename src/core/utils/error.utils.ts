import { ValidationError } from '../types/validation-error.types';

export const createErrorMessages = (
  errors: ValidationError[],
): { errorsMessages: ValidationError[] } => {
  return { errorsMessages: [{field: "string", //erros
  message: "string"}]  };
};
