import { Server } from 'socket.io';
import { ITokenService } from '@/domain/serviceInterface/ITokenService';
import { socketAuthMiddleware } from '@/presentation/http/middlewares/socketAuthMiddleware';
import logger from '@/utils/logger';
import { IChatSocketHandler } from '@/useCases/interfaces/chat/IChatSocketHandler';
import { IVideoCallSocketHandler } from '@/useCases/interfaces/videoCall/IVideoCallSocketHandler';
import { INotificationSocketHandler } from '@/useCases/interfaces/notification/INotificationSocketHandler';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';

const onlineUsers: Map<string, Set<string>> = new Map();

export function configureSocket(
    io: Server,
    chatSocketHandler: IChatSocketHandler,
    videoCallSocketHandler: IVideoCallSocketHandler,
    notificationSocketHandler: INotificationSocketHandler,
    tokenService: ITokenService,
    userRepo: IUserRepository,
) {
    // apply the middleware
    io.use(socketAuthMiddleware(tokenService, ['user', 'psychologist'], userRepo));

    // register the handler
    io.on('connection', socket => {
        const userId = socket.data.userId; // from socketAuthMiddleware
        if (!userId) {
            logger.warn(`Socket ${socket.id} connected without userId`);
            return;
        }

        // === Mark user online ===
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
            io.emit('user_online', { userId });
            logger.info(`User ${userId} is now ONLINE`);
        }
    onlineUsers.get(userId)!.add(socket.id);

    logger.info(`Socket connected: ${socket.id} for user: ${userId}`);

    // Attach other handlers
    chatSocketHandler.register(io, socket);
    videoCallSocketHandler.register(io, socket);
    notificationSocketHandler.register(socket);

    // === Handle disconnect ===
    socket.on('disconnect', () => {
        const sockets = onlineUsers.get(userId);
        if (!sockets) return;

        sockets.delete(socket.id);
        if (sockets.size === 0) {
            onlineUsers.delete(userId);
            io.emit('user_offline', { userId });
            logger.info(`User ${userId} is now OFFLINE`);
        }
    });

    // === Allow client to request online users ===
    socket.on('get_online_users', (ack?: (users: string[]) => void) => {
        ack?.([...onlineUsers.keys()]);
    });
    });
}
