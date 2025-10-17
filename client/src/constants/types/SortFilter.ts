export const SortFilter = {
  Asc: 'asc',
  Desc: 'desc',
} as const;

export type SortFilterType = typeof SortFilter[keyof typeof SortFilter];
