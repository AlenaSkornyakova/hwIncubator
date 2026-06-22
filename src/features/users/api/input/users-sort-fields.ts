export const userSortFields = [
      'id',
      'login',
      'email',
      'createdAt',
] as const;

export type UserSortBy = typeof userSortFields[number];