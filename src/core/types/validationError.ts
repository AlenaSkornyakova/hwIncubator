export type ValidationError = {
  field: string;
  message: string;
  
};

export type ErrorResponse = { 
  errorMessages: ValidationError[];
};