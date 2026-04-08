export const postSortFields = [
      'id',
      'title',
      'shortDescription',
      'content',
      'blogId',
      'blogName',
      'createdAt',
] as const;

export type PostSortBy = typeof postSortFields[number];