import {validateVideoCommonFields } from './video-common.validation';
import { VideoInputDto } from '../dto/video-input.dto';
import { ValidationError } from '../../core/types/validationError';


export function validateVideoInput(body: VideoInputDto ): ValidationError[] {
  const errors: ValidationError[] = [];
   errors.push(...validateVideoCommonFields(body));
 return errors;
  

}
