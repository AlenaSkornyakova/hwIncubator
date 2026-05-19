import { body } from 'express-validator';
import { ResourceType } from '../types/resource-type.types';

export function resourceTypeValidation(resourceType: ResourceType) {
  return body('data.type')
    .isString()
    .equals(resourceType)
    .withMessage(`Resource type must be ${resourceType}`);
}