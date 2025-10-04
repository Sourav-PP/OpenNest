export interface IMessageDto {
  id: string;
  consultationId: string;
  clientId?: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  deliveredTo?: string[];
  readAt?: Date;
  mediaUrl?: string;
  mediaType?: string | null;
  deleted: boolean;
  deletedBy?: string; 
  replyToId?: string;
  reaction?: Array<{userId: string; emoji: string}>;
  createdAt: string;
  updatedAt?: string;
}