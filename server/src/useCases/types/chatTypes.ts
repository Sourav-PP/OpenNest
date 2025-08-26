export interface ISendMessageInput {
    clientId: string;
    consultationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    mediaUrl?: string;
    mediaTypes?: string;
}