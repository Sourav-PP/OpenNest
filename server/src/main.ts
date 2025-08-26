import { createServer } from 'http';
import { appConfig } from './infrastructure/config/config';
import { connectDB } from './infrastructure/database/mongoose';
import { app } from './presentation/http/server';
import logger from './utils/logger';
import { Server } from 'socket.io';
import { chatSocketHandler } from './infrastructure/config/di';

async function startServer() {
    await connectDB();

    const httpServer = createServer(app);

    const io = new Server(httpServer, {
        cors: {
            origin: appConfig.cors.origin,
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', socket => {
        chatSocketHandler.register(io, socket);
    });

    httpServer.listen(appConfig.server.port, () => {
        logger.info(`Server running on port ${appConfig.server.port}`);
    });
}

startServer();
