import { ValidationError } from '../../core/types/validationError';
import { VideoResolution } from '../types/video';

type CommonFields = {
  title: unknown;
  author: unknown;
  availableResolutions: unknown;
};

export function validateVideoCommonFields(body: CommonFields): ValidationError[] {
  const errors: ValidationError[] = [];
  
  //"title": "string",
  if (
    body.title === undefined ||
    typeof body.title !== 'string' ||
    body.title.trim() === '' ||
    body.title.length > 40 ||
    body.title.length < 2
  ) {
    errors.push({
      field: 'title',
      message: 'Title is required, must be a non-empty string between 2 and 40 characters.',
    });
  }

  //"author": "string",
  if (
    body.author === undefined ||
    typeof body.author !== 'string' ||
    body.author.trim() === '' ||
    body.author.length > 20 ||
    body.author.length < 2
  ) {
    errors.push({
      field: 'author',
      message: 'Author is required, must be a non-empty string between 2 and 20 characters.',
    });
  }

  //"availableResolutions": VideoResolution[],
  if (!Array.isArray(body.availableResolutions)) {
    errors.push({
      field: 'availableResolutions',
      message: 'AvailableResolutions must be an array.',
    });
  } else if (body.availableResolutions.length < 1) {
    errors.push({
      field: 'availableResolutions',
      message: 'At least one resolution should be added',
    });
    } else {

    const validVideoResolutions = Object.values(VideoResolution);

    for (const res of body.availableResolutions) {
      if (!validVideoResolutions.includes(res)) {
        errors.push({
          field: 'availableResolutions',
          message: `Invalid resolution: ${res}`,
        });
        break;
      }
    }
  }

  return errors;
}