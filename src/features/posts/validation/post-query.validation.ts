import { query } from "express-validator";
import { sortDirections } from "../../../core/types/sort-direction.types";
import { postSortFields } from "../routers/input/posts-sort-fields";


export const postQueryValidation = 
[
  // pageNumber
query ('pageNumber')
.optional()
.isInt({ min: 1 })
.withMessage('pageNumber must be an integer greater than 0')
.toInt(),
// pageSize
query('pageSize')
.optional()
.isInt({ min: 1, max: 100 })
.withMessage('pageSize must be an integer between 1 and 100')
.toInt(),
// sortBy
query('sortBy')
.optional()
.isIn( postSortFields)
.withMessage('sortBy must be either "name", "createdAt", "id", "description", or "websiteUrl"'),
// sortDirection
query('sortDirection')
.optional()
.isIn(sortDirections)
.withMessage('sortDirection must be either "asc" or "desc"'),
];  
