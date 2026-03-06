import winston from 'winston';

export enum LOG_LEVEL {
    ERROR = 3,
    WARNING = 2,
    INFO = 1,
    DEBUG = 0,
}

export type Meta = Record<string, unknown>;

export const stdoutLogger = winston.createLogger({
    format: winston.format.json(),
    level: process.env.LOG_LEVEL ?? 'info',
    transports: [new winston.transports.Console()],
});

export const logInfo = (message: string, meta: Meta = {}) => {
    stdoutLogger.info(message, meta);
};

export const logError = (message: string, err?: unknown, meta: Meta = {}) => {
    const errorMeta: Meta =
        err === undefined ? {} : { error: err instanceof Error ? err.message : String(err) };

    stdoutLogger.error(message, {
        ...meta,
        ...errorMeta,
    });
};
