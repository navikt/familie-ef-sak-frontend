import { LOG_LEVEL, logDebug, logError, logInfo, logWarn } from 'backend/logger';
import { Request } from 'express';

let erForbindelsenTilRedisTilgjengelig = true;

export const settErforbindelsenTilRedisTilgjengelig = (verdi: boolean) => {
    erForbindelsenTilRedisTilgjengelig = verdi;
};

export const hentErforbindelsenTilRedisTilgjengelig = (): boolean => {
    return erForbindelsenTilRedisTilgjengelig;
};

export const envVar = (navn: string, påkrevd = true, defaultValue?: string): string => {
    const envVariable = process.env[navn];
    if (!envVariable && påkrevd && !defaultValue) {
        logError(`Mangler påkrevd miljøvariabel '${navn}'`);
        process.exit(1);
    }
    if (!envVariable && defaultValue) {
        return defaultValue;
    } else {
        return envVariable as string;
    }
};

const prefix = (req: Request) => {
    return `${
        req.session && req.session.user
            ? `${req.session.user.displayName} -`
            : 'ugyldig sesjon eller mangler brukers data -'
    } ${req.method} - ${req.originalUrl}`;
};

export const logRequest = (req: Request, message: string, level: LOG_LEVEL) => {
    const melding = `${prefix(req)}: ${message}`;
    const callId = req.header('nav-call-id');
    const requestId = req.header('x-request-id');

    const meta = {
        ...(callId ? { x_callId: callId } : {}),
        ...(requestId ? { x_requestId: requestId } : {}),
    };
    switch (level) {
        case LOG_LEVEL.DEBUG:
            logDebug(melding, meta);
            break;
        case LOG_LEVEL.INFO:
            logInfo(melding, meta);
            break;
        case LOG_LEVEL.WARNING:
            logWarn(melding, meta);
            break;
        case LOG_LEVEL.ERROR:
            logError(melding, undefined, meta);
            break;
        default:
            logInfo(melding, meta);
    }
};
