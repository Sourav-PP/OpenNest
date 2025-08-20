import { appConfig } from './infrastructure/config/config';
import { connectDB } from './infrastructure/database/mongoose';
import { app } from './presentation/http/server';
import logger from './utils/logger';

async function startServer() {
    await connectDB();

    app.listen(appConfig.server.port, () => {
        logger.info(`Server running on port ${appConfig.server.port}`);
    });
}

startServer();