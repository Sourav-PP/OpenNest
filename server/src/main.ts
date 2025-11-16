import 'tsconfig-paths/register';
import { createServer } from 'http';
import { appConfig } from './infrastructure/config/config';
import { connectDB } from './infrastructure/database/mongoose';
import { app } from './presentation/http/server';
import logger from './utils/logger';
import { Server } from 'socket.io';
import {
    chatSocketHandler,
    videoCallSocketHandler,
    tokenService,
    notificationRepository,
    updateMissedConsultationsUseCase,
    clearPendingPaymentUseCase,
    setNotificationSocketHandler,
    initNotificationService,
    userRepository,
} from './infrastructure/config/di';
import { configureSocket } from './infrastructure/config/socket';
import { NotificationSocketHandler } from './presentation/socket/notificationSocketHandler';
import { NotificationJob } from './infrastructure/cron/notificationJob';
import { ConsultationMissedJob } from './infrastructure/cron/consultationMissedJob';
import { connectRedis } from './infrastructure/redis/redisClient';
import { ClearPendingPaymentJob } from './infrastructure/cron/clearPendingPaymentJob';

async function startServer() {
    await connectDB();
    await connectRedis();

    const httpServer = createServer(app);

    const io = new Server(httpServer, {
        cors: {
            origin: appConfig.cors.origin,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    const notificationSocketHandler = new NotificationSocketHandler(io);
    setNotificationSocketHandler(notificationSocketHandler);
    initNotificationService();
    configureSocket(io, chatSocketHandler, videoCallSocketHandler, notificationSocketHandler, tokenService, userRepository);
    const notificationJob = new NotificationJob(notificationRepository, notificationSocketHandler);
    const consultationMissedJob = new ConsultationMissedJob(updateMissedConsultationsUseCase);
    const clearPendingPaymentJob = new ClearPendingPaymentJob(clearPendingPaymentUseCase);

    notificationJob.start();
    consultationMissedJob.start();
    clearPendingPaymentJob.start();

    httpServer.listen(appConfig.server.port, () => {
        logger.info(`Server running on port ${appConfig.server.port}`);
    });
}

startServer();
