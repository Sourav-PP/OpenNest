export class AppError<T = unknown> extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly errors?: T;

    constructor(
        message: string,
        statusCode = 500,
        isOperational = true,
        errors?: T,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;
        this.name = 'AppError';

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}