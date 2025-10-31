import { Server, Socket } from 'socket.io';
import { IChatSocketHandler } from '@/useCases/interfaces/chat/IChatSocketHandler';
import { ISendMessageUseCase } from '@/useCases/interfaces/chat/ISendMessageUseCase';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { IMarkReadUseCase } from '@/useCases/interfaces/chat/IMarkReadUseCase';
import { IDeleteMessageUseCase } from '@/useCases/interfaces/chat/IDeleteMessageUseCase';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import logger from '@/utils/logger';
import { getRoomId } from '@/utils/getRoomId';

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
        socket.on('join_consultation', async(roomId: string, ack?: (res: any) => void) => {
            try {
                if (!roomId) {
                    return ack?.({
                        success: false,
                        error: chatMessages.ERROR.INVALID_CONSULTATION_ID,
                    });
                }

                console.log('roomId: ', roomId);

                await socket.join(roomId);
                logger.info(`Room members: ${[...io.sockets.adapter.rooms.get(roomId) || []]}`);

                logger.info(`Socket ${socket.id} joined consultation: ${roomId}`);

                return ack?.({ success: true, roomId: roomId });
            } catch (err) {
                logger.error(`Error occurred in join_consultation for socket ${socket.id}`, err);
                return ack?.({
                    success: false,
                    error: 'Internal server error',
                });
            }
        });

        // sending message
        socket.on('send_message', async data => {
            try {
                const roomId = data.roomId || getRoomId(data.senderId, data.receiverId);
                console.log('roomId in sendmessage: ', roomId);
                const payload = { ...data, roomId };

                const message = await this._sendMessageUseCase.execute(payload);
                io.to(roomId).emit('new_message', message);
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

        socket.on('delete', async(data: { messageId: string; roomId: string }) => {
            try {
                if (!data?.messageId || !data?.roomId) {
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

                io.to(data.roomId).emit('message_deleted', {
                    messageId: deletedMessage.id,
                    roomId: data.roomId,
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
        socket.on('mark_as_read', async(roomId: string, userId: string) => {
            try {
                await this._markAsReadUseCase.execute(roomId, userId);
                io.to(roomId).emit('message_read', {
                    roomId,
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
        });

        // typing indicator
        socket.on('typing', ({ roomId, senderId }: { roomId: string; senderId: string }) => {
            // emit to everyone in the room except the sender
            socket.to(roomId).emit('typing', { roomId, senderId });
        });

        socket.on('stop_typing', ({ roomId, senderId }: { roomId: string; senderId: string }) => {
            socket.to(roomId).emit('stop_typing', { roomId, senderId });
        });
    }
}
