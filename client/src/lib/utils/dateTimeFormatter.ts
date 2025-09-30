// Get user locale and timezone once
const getUserLocale = () => navigator.language || 'en-US';
const getUserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

// Format just time, e.g., "10:30 AM" or "22:30" depending on locale
export const formatTime = (date: Date | string, force12h?: boolean) => {
  return new Intl.DateTimeFormat(getUserLocale(), {
    hour: 'numeric',
    minute: 'numeric',
    ...(force12h ? { hour12: true } : {}),
    timeZone: getUserTimeZone(),
  }).format(new Date(date));
};

// Format full date & time, e.g., "Saturday, 27 September 2025, 10:00 AM"
export const formatDateTime = (date: Date | string, force12h?: boolean) => {
  return new Intl.DateTimeFormat(getUserLocale(), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    ...(force12h ? { hour12: true } : {}),
    timeZone: getUserTimeZone(),
  }).format(new Date(date));
};

// Format date only, e.g., "Saturday, 27 September 2025"
export const formatDateOnly = (date: Date | string) => {
  return new Intl.DateTimeFormat(getUserLocale(), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: getUserTimeZone(),
  }).format(new Date(date));
};

// Format time range, e.g., "10:00 AM to 11:00 AM"
export const formatTimeRange = (start: Date | string, end: Date | string, force12h?: boolean) =>
  `${formatTime(start, force12h)} to ${formatTime(end, force12h)}`;

// Format duration, e.g., "1h 15m"
export const formatDuration = (start: Date | string, end: Date | string) => {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.round(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return hours > 0 ? `${hours}h ${remMins}m` : `${remMins}m`;
};
