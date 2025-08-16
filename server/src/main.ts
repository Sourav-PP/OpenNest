import { appConfig } from './infrastructure/config/config';
import { connectDB } from './infrastructure/database/mongoose';
import { app } from './presentation/http/server';

async function startServer() {
    await connectDB();

    app.listen(appConfig.server.port, () => {
        console.log(`Server running on port ${appConfig.server.port}`);
    });
}

startServer();