export const getRoomId = (userId: string, psychologistId: string): string => {
  const [a, b] = [userId, psychologistId].sort();
  return `room_${a}_${b}`;
};