import { PaginatedOutput } from '../../../../core/types/paginated.output';
import { BlogDataOutput } from './blog-data.output';

export type BlogListPaginatedOutput = PaginatedOutput<BlogDataOutput>;