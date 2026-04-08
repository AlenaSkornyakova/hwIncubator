export const blogSortFields = [
  'id',
  'name',
  'description',
  'websiteUrl',
  'createdAt',
] as const;

export type BlogSortBy = typeof blogSortFields[number];