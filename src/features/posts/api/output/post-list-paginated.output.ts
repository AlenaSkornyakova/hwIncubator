import { PaginatedOutput } from '../../../../core/types/paginated-output.types';
import { PostOutput } from './post.output';

export type PostListPaginatedOutput =
  PaginatedOutput<PostOutput>;