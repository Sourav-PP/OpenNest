import { Server } from 'socket.io';
import { ITokenService } from '@/domain/serviceInterface/ITokenService';
import { socketAuthMiddleware } from '@/presentation/http/middlewares/socketAuthMiddleware';
import logger from '@/utils/logger';
import { IChatSocketHandler } from '@/useCases/interfaces/chat/IChatSocketHandler';
import { IVideoCallSocketHandler } from '@/useCases/interfaces/videoCall/IVideoCallSocketHandler';

export function configureSocket(
    io: Server,
    chatSocketHandler: IChatSocketHandler,
    videoCallSocketHandler: IVideoCallSocketHandler,
    tokenService: ITokenService,
) {
    // apply the middleware
    io.use(socketAuthMiddleware(tokenService, ['user', 'psychologist']));

    // register the handler
    io.on('connection', socket => {
        logger.info(`Socket connected: ${socket.id}`);
        chatSocketHandler.register(io, socket);
        videoCallSocketHandler.register(io, socket);
    });
}
