import { PaginatedOutput } from '../../../../core/types/paginated-output.types';

import { PostDataOutput } from './post-data.output';

export type PostListPaginatedOutput =
  PaginatedOutput<PostDataOutput>;