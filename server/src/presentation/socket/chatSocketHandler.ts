import { Server, Socket } from 'socket.io';
import { IChatSocketHandler } from '@/useCases/interfaces/chat/IChatSocketHandler';
import { ISendMessageUseCase } from '@/useCases/interfaces/chat/ISendMessageUseCase';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { chatMessages } from '@/shared/constants/messages/chatMessages';

export class ChatSocketHandler implements IChatSocketHandler {
    private _sendMessageUseCase: ISendMessageUseCase;

    constructor(sendMessageUseCase: ISendMessageUseCase) {
        this._sendMessageUseCase = sendMessageUseCase;
    }

    register(io: Server, socket: Socket): void {
        socket.on('join_consultation', (consultationId: string) => {
            socket.join(consultationId);
        });

        socket.on('send_message', async data => {
            try {
                console.log('its coming here....');
                const message = await this._sendMessageUseCase.execute(data);
                io.to(data.consultationId).emit('receive_message', message);
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
    }
}
