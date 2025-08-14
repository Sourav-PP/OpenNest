import { createLogger, format, transports } from 'winston';
import path from 'path';

const customFormat = format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const isDev = process.env.NODE_ENV === 'development';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        isDev ? customFormat : format.json(),
    ),
    transports: [
        new transports.File({
            filename: path.join(__dirname, '../../../logs/error.log'),
            level: 'error',
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.errors({ stack: true }),
                format.json(),
            ),
        }),
        new transports.File({
            filename: path.join(__dirname, '../../../logs/warn.log'),
            level: 'warn',
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.json(),
            ),
        }),
        new transports.File({
            filename: path.join(__dirname, '../../../logs/combined.log'),
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.json(),
            ),
        }),
        ...(isDev
            ? [new transports.Console({ format: format.combine(format.colorize(), customFormat) })]
            : []),
    ],
});

export default logger;
