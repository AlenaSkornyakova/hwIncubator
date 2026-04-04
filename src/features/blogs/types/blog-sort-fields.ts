export const blogSortFields = [
  'createdAt',
  'name',
  'description',
  'websiteUrl',
] as const;

export type BlogSortBy = typeof blogSortFields[number];