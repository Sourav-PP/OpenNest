export const UserRole = {
  USER: 'user',
  PSYCHOLOGIST: 'psychologist',
  ADMIN: 'admin',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const UserGender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;

export type UserGenderType = (typeof UserGender)[keyof typeof UserGender];

export const UserGenderFilter = {
  ALL: 'all',
  ...UserGender,
} as const;

export type UserGenderFilterType = (typeof UserGenderFilter)[keyof typeof UserGenderFilter];