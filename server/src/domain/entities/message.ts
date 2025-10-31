import { MessageStatus } from '../enums/MessageEnums';

export interface Message {
    id: string;
    roomId: string;
    clientId?: string;
    senderId: string;
    receiverId: string;
    content: string;
    status: MessageStatus;
    deliveredTo?: string[];
    readAt?: Date;
    mediaUrl?: string;
    mediaType?: string | null;
    deleted: boolean;
    deletedBy?: string;
    replyToId?: string;
    reaction?: Array<{ userId: string; emoji: string }>;
    createdAt?: Date;
    updatedAt?: Date;
}
