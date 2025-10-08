export interface INotificationDto {
  id: string;
  message: string;
  type:
    | 'CONSULTATION_BOOKED'
    | 'CONSULTATION_CANCELLED'
    | 'CONSULTATION_REMINDER'
    | 'NEW_MESSAGE'
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_FAILED'
    | 'FEEDBACK_RECEIVED';
  consultationId?: string | undefined;
  read: boolean;
}
