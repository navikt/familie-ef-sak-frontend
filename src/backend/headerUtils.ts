import { urlAInntekt } from './config';
import { Response } from 'express';

const cspHeaderName = 'Content-Security-Policy';
const cspPrefix = "default-src 'self'";

/**
 * Legger til url til Ainntekt for å kunne kalle på a-inntekt-redirect for å generere custom url til a-inntekt
 */
export const customCspHeader = (res: Response): void => {
    const cspHeader = res.getHeader(cspHeaderName);
    if (typeof cspHeader === 'string') {
        if (cspHeader.indexOf(cspPrefix) > -1) {
            res.header(
                cspHeaderName,
                `${cspPrefix} ${urlAInntekt} ${cspHeader.substring(cspPrefix.length)}`
            );
        }
    }
};
