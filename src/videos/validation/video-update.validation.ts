import { ValidationError } from '../../core/types/validationError';
import { VideoUpdateInputDto } from '../dto/video-update.input.dto';
import { validateVideoCommonFields } from './video-common.validation';

export function validateVideoUpdate(body: VideoUpdateInputDto): ValidationError[] {
  const errors: ValidationError[] = [];
  const { canBeDownloaded, minAgeRestriction, publicationDate} = body;
  
    errors.push(...validateVideoCommonFields(body));

  //"canBeDownloaded": true,
  if (body.canBeDownloaded !== undefined && typeof canBeDownloaded !== 'boolean') {
    errors.push({
      field: 'canBeDownloaded',
      message: 'canBeDownloaded must be a boolean.',
    });
  }

  //"minAgeRestriction": null | number (0-18)
  if (
    minAgeRestriction !== undefined &&
    minAgeRestriction !== null &&
    (typeof minAgeRestriction !== 'number' ||
      minAgeRestriction < 0 ||
      minAgeRestriction > 18)
  ) {
    errors.push({
      field: 'minAgeRestriction',
      message: 'minAgeRestriction must be null or a number between 0 and 18.',
    });
  }
  
  //"publicationDate": string (ISO date format)
  if (
    publicationDate !== undefined &&
    (typeof publicationDate !== 'string' ||
      isNaN(Date.parse(publicationDate)))
  ) {
    errors.push({
      field: 'publicationDate',
      message: 'publicationDate must be a valid ISO date string.',
    });
  }

  return errors;
}
