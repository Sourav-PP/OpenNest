export const MessageStatus = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
} as const;

export type MessageStatusType = (typeof MessageStatus)[keyof typeof MessageStatus];