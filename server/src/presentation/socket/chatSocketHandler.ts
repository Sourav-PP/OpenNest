import { Server, Socket } from 'socket.io';
import { IChatSocketHandler } from '@/useCases/interfaces/chat/IChatSocketHandler';
import { ISendMessageUseCase } from '@/useCases/interfaces/chat/ISendMessageUseCase';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { IMarkReadUseCase } from '@/useCases/interfaces/chat/IMarkReadUseCase';
import { IDeleteMessageUseCase } from '@/useCases/interfaces/chat/IDeleteMessageUseCase';
import { generalMessages } from '@/shared/constants/messages/generalMessages';

export class ChatSocketHandler implements IChatSocketHandler {
    private _sendMessageUseCase: ISendMessageUseCase;
    private _markAsReadUseCase: IMarkReadUseCase;
    private _deleteMessageUseCase: IDeleteMessageUseCase;

    constructor(
        sendMessageUseCase: ISendMessageUseCase,
        markAsReadUseCase: IMarkReadUseCase,
        deleteMessageUseCase: IDeleteMessageUseCase,
    ) {
        this._sendMessageUseCase = sendMessageUseCase;
        this._markAsReadUseCase = markAsReadUseCase;
        this._deleteMessageUseCase = deleteMessageUseCase;
    }

    register(io: Server, socket: Socket): void {
        socket.on(
            'join_consultation',
            async(consultationId: string, ack?: (res: any) => void) => {
                try {
                    if (!consultationId) {
                        return ack?.({
                            success: false,
                            error: chatMessages.ERROR.INVALID_CONSULTATION_ID,
                        });
                    }

                    await socket.join(consultationId);
                    console.log(
                        `Socket ${socket.id} joined consultation: ${consultationId}`,
                    );

                    return ack?.({ success: true, roomId: consultationId });
                } catch (err) {
                    console.error('join_consultation error:', err);
                    return ack?.({
                        success: false,
                        error: 'Internal server error',
                    });
                }
            },
        );

        // sending message
        socket.on('send_message', async data => {
            try {
                console.log('its coming here in send....', socket.data);
                const message = await this._sendMessageUseCase.execute(data);
                io.to(data.consultationId).emit('new_message', message);
            } catch (err) {
                if (err instanceof AppError) {
                    socket.emit('chat_error', {
                        status: err.statusCode,
                        message: err.message,
                    });
                } else {
                    socket.emit('chat_error', {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: chatMessages.ERROR.MESSAGE_FAILED,
                    });
                }
            }
        });

        socket.on('delete', async(data: { messageId: string, consultationId: string }) => {
            try {
                if (!data?.messageId || !data?.consultationId) {
                    return socket.emit('chat_error', {
                        status: HttpStatus.BAD_REQUEST,
                        message: chatMessages.ERROR.INVALID_MESSAGEID_OR_CONSULTATION_ID,
                    });
                }

                const deletedMessage = await this._deleteMessageUseCase.execute(data.messageId, socket.data.userId);

                if (!deletedMessage) {
                    return socket.emit('chat_error', {
                        status: HttpStatus.NOT_FOUND,
                        message: generalMessages.ERROR.INTERNAL_SERVER_ERROR,
                    });
                }
                
                io.to(data.consultationId).emit('message_deleted', {
                    messageId: deletedMessage.id,
                    consultationId: data.consultationId,
                    deletedBy: socket.data.userId,
                    isDeleted: true,
                });
            } catch (err) {
                if (err instanceof AppError) {
                    socket.emit('chat_error', {
                        status: err.statusCode,
                        message: err.message,
                    });
                } else {
                    socket.emit('chat_error', {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: chatMessages.ERROR.MESSAGE_FAILED,
                    });
                }
            }
        });

        // mark message as read
        socket.on(
            'mark_as_read',
            async(consultationId: string, userId: string) => {
                try {
                    console.log('marking as read');
                    console.log('mark_consultationId: ', consultationId);
                    console.log('mark_userId: ', userId);
                    await this._markAsReadUseCase.execute(
                        consultationId,
                        userId,
                    );
                    io.to(consultationId).emit('message_read', {
                        consultationId,
                        userId,
                    });
                } catch (err) {
                    if (err instanceof AppError) {
                        socket.emit('chat_error', {
                            status: err.statusCode,
                            message: err.message,
                        });
                    } else {
                        socket.emit('chat_error', {
                            status: HttpStatus.INTERNAL_SERVER_ERROR,
                            message: chatMessages.ERROR.MESSAGE_FAILED,
                        });
                    }
                }
            },
        );

        // typing indicator
        socket.on('typing', (consultationId: string) => {
            socket
                .to(consultationId)
                .emit('typing', { userId: socket.data.userId });
        });
        socket.on('stop_typing', (consultationId: string) => {
            socket
                .to(consultationId)
                .emit('stop_typing', { userId: socket.data.userId });
        });

        
    }
}
