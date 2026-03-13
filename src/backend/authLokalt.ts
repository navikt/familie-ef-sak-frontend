import { Request, Response, NextFunction, RequestHandler } from 'express';
import { logInfo, logError } from './logger';

const TENANT = 'trygdeetaten.no';
const AUTHORIZATION_ENDPOINT = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/authorize`;
const TOKEN_ENDPOINT = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`;

interface AuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

export interface Saksbehandler {
    displayName: string;
    email: string;
    navIdent: string;
    enhet: string;
    groups: string[];
    accessToken: string;
}

declare module 'express-session' {
    interface SessionData {
        user?: Saksbehandler;
        state?: string;
        nonce?: string;
        codeVerifier?: string;
        redirectUrl?: string;
    }
}

const mockSaksbehandler: Saksbehandler = {
    displayName: 'Lokal Bruker',
    email: 'lokal.bruker@nav.no',
    navIdent: 'Z999999',
    enhet: '4820',
    groups: [],
    accessToken: 'mock-token',
};

const generateRandomString = (length = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const generateCodeChallenge = async (verifier: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Buffer.from(hash)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
};

const hentLokalAuthConfig = (): AuthConfig | null => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.AAD_REDIRECT_URL;

    if (!clientId || !clientSecret || !redirectUri) {
        return null;
    }

    return { clientId, clientSecret, redirectUri };
};

export const handleLoginLokalt = async (req: Request, res: Response): Promise<void> => {
    if (process.env.ENV === 'local') {
        req.session.user = mockSaksbehandler;
        res.redirect('/');
        return;
    }

    const authConfig = hentLokalAuthConfig();
    if (!authConfig) {
        res.status(500).send('Auth ikke konfigurert');
        return;
    }

    const efSakScope = process.env.EF_SAK_SCOPE;
    if (!efSakScope) {
        res.status(500).send('EF_SAK_SCOPE miljøvariabel må være satt');
        return;
    }

    const state = generateRandomString();
    const nonce = generateRandomString();
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    req.session.state = state;
    req.session.nonce = nonce;
    req.session.codeVerifier = codeVerifier;

    const params = new URLSearchParams({
        client_id: authConfig.clientId,
        response_type: 'code',
        redirect_uri: authConfig.redirectUri,
        response_mode: 'query',
        scope: `openid profile email ${efSakScope}`,
        state,
        nonce,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    });

    const authUrl = `${AUTHORIZATION_ENDPOINT}?${params.toString()}`;
    logInfo(`Redirecting to Azure AD for login`);
    res.redirect(authUrl);
};

export const handleCallbackLokalt = async (req: Request, res: Response): Promise<void> => {
    const authConfig = hentLokalAuthConfig();
    if (!authConfig) {
        res.status(500).send('Auth ikke konfigurert');
        return;
    }

    const { code, state } = req.query;

    if (state !== req.session.state) {
        res.status(400).send('Ugyldig state parameter');
        return;
    }

    if (!code || typeof code !== 'string') {
        res.status(400).send('Mangler autorisasjonskode');
        return;
    }

    try {
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: authConfig.clientId,
            client_secret: authConfig.clientSecret,
            code,
            redirect_uri: authConfig.redirectUri,
            code_verifier: req.session.codeVerifier || '',
        });

        const tokenResponse = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams.toString(),
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            logError('Token exchange failed', new Error(errorText));
            res.status(500).send('Kunne ikke bytte kode mot tokens');
            return;
        }

        const tokens = await tokenResponse.json();
        const idTokenPayload = JSON.parse(
            Buffer.from(tokens.id_token.split('.')[1], 'base64').toString()
        );

        req.session.user = {
            displayName: idTokenPayload.name,
            email: idTokenPayload.email || idTokenPayload.upn,
            navIdent: idTokenPayload.NAVident,
            enhet: '',
            groups: idTokenPayload.groups || [],
            accessToken: tokens.access_token,
        };

        const redirectUrl = req.session.redirectUrl || '/';
        delete req.session.state;
        delete req.session.nonce;
        delete req.session.codeVerifier;
        delete req.session.redirectUrl;

        logInfo(`Bruker ${idTokenPayload.NAVident} logget inn`);
        res.redirect(redirectUrl);
    } catch (error) {
        logError('Authentication callback error', error as Error);
        res.status(500).send('Autentisering feilet');
    }
};

export const handleLogoutLokalt = (req: Request, res: Response): void => {
    const navIdent = req.session.user?.navIdent;
    req.session.destroy((err) => {
        if (err) {
            logError('Logout error', err);
        } else {
            logInfo(`Bruker ${navIdent} logget ut`);
        }
        res.redirect('/');
    });
};

export const sørgForAutentiseringLokalt = (): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const publicPaths = [
            '/oauth2/login',
            '/oauth2/callback',
            '/oauth2/logout',
            '/isAlive',
            '/isReady',
        ];
        const erPublicPath = publicPaths.some((path) => req.path.startsWith(path));
        const erAsset = req.path.startsWith('/assets') || req.path.includes('.');

        if (process.env.ENV === 'local' && !erPublicPath && !erAsset && !req.session.user) {
            req.session.user = mockSaksbehandler;
        }

        if (!erPublicPath && !erAsset && !req.session.user) {
            req.session.redirectUrl = req.originalUrl;
            return res.redirect('/oauth2/login');
        }

        return next();
    };
};

export const hentAccessTokenFraSession = (req: Request): string | null => {
    return req.session.user?.accessToken ?? null;
};

export const erLokaltMotPreprod = (): boolean => {
    return process.env.ENV === 'lokalt-mot-preprod';
};
