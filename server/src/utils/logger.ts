import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';
import { appConfig } from '@/infrastructure/config/config';

const isDev = appConfig.server.nodeEnv === 'development';

// Custom console format
const customFormat = format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${stack || message}${metaString}`;
});

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        isDev ? customFormat : format.json(),
    ),
    transports: [
        // MongoDB transport
        new transports.MongoDB({
            db: `${appConfig.db.url}/opennest?retryWrites=true&w=majority`,
            collection: 'app_logs',
            level: 'info',
            options: { useUnifiedTopology: true },
            expireAfterSeconds: 30 * 24 * 60 * 60,
            storeHost: true,
            capped: false,
        }),

        ...(isDev ? [new transports.Console({ format: format.combine(format.colorize(), customFormat) })] : []),
    ],
});

export default logger;
