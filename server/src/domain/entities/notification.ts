export interface Notification {
  id: string;
  senderId?: string;
  recipientId: string;
  consultationId?: string;
  type:
    | 'CONSULTATION_BOOKED'
    | 'CONSULTATION_CANCELLED'
    | 'CONSULTATION_REMINDER' 
    | 'NEW_MESSAGE'
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_FAILED'
    | 'FEEDBACK_RECEIVED';
  message: string;
  read: boolean;
  notifyAt: Date;
  sent: boolean;
  createdAt?: Date;
}