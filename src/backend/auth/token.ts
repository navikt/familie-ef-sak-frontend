import { getToken, requestOboToken, validateToken } from '@navikt/oasis';
import { logError, LOG_LEVEL } from '@navikt/familie-logging';
import { NextFunction, Request, Response } from 'express';
import { AuthenticationResult, ConfidentialClientApplication } from '@azure/msal-node';
import { logRequest } from '@navikt/familie-backend';

export const tokenSetSelfId = 'self';

export async function getOnBehalfOfToken(request: Request, audience: string) {
    const token = getToken(request);

    if (!token) {
        logError('Missing token');
        throw new Response('Missing token', { status: 401 });
    }

    const validation = await validateToken(token);
    if (!validation.ok) {
        logError(`Failed to validate token: ${validation.error}`);
        throw new Response('Token validation failed', { status: 401 });
    }

    const obo = await requestOboToken(token, audience);
    if (!obo.ok) {
        logError(`Failed to get OBO token: ${obo.error}`);
        throw new Response('Unauthorized', { status: 401 });
    }

    return obo.token;
}

export const ensureAuthenticated = (
    authClient: ConfidentialClientApplication,
    sendUnauthorized: boolean
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = req.session?.passport?.user;
        const account = user?.account;
        const scopes = user?.scopes ?? ['default-scope'];

        if (!account) {
            return handleUnauthorized(req, res, sendUnauthorized);
        }

        authClient
            .acquireTokenSilent({ account, scopes })
            .then((result: AuthenticationResult) => {
                if (!req.session) {
                    throw new Error('Mangler sesjon på kall');
                }

                req.session.passport.user.tokenSets[tokenSetSelfId] = {
                    access_token: result.accessToken,
                    id_token: result.idToken,
                    expires_at: result.expiresOn?.getTime(),
                    claims: result.idTokenClaims,
                };

                return next();
            })
            .catch((err) => {
                const message =
                    err instanceof Error
                        ? err.message
                        : typeof err === 'string'
                          ? err
                          : 'Ukjent feil ved token renewal';

                logRequest(req, `Token renewal failed: ${message}`, LOG_LEVEL.WARNING);

                const pathname = req.originalUrl;
                if (sendUnauthorized) {
                    res.status(401).send('Unauthorized');
                } else {
                    res.redirect(`/login?redirectUrl=${pathname}`);
                }
                return;
            });
    };
};

const handleUnauthorized = (req: Request, res: Response, sendUnauthorized: boolean) => {
    const pathname = req.originalUrl;
    if (sendUnauthorized) {
        res.status(401).send('Unauthorized');
    } else {
        res.redirect(`/login?redirectUrl=${pathname}`);
    }
};
