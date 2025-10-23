export const SortFilter = {
  Asc: 'asc',
  Desc: 'desc',
} as const;

export type SortFilterType = typeof SortFilter[keyof typeof SortFilter];

export const RevenueFilter = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

export type RevenueFilterType = typeof RevenueFilter[keyof typeof RevenueFilter];

export const TopPsychologistFilter = {
  CONSULTATION: 'consultation',
  RATING: 'rating',
  COMBINED: 'combined',
};

export type TopPsychologistFilterType = typeof TopPsychologistFilter[keyof typeof TopPsychologistFilter];
