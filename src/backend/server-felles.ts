import './konfigurerApp.js';
import express, { Express, Request, Response, Router } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import {
    brevProxyUrl,
    sakProxyUrl,
    erLokalUtvikling,
    graphApiUrl,
    graphApiScope,
} from './config.js';
import { addRequestInfo, attachToken, doProxy } from './proxy.js';
import setupRouter, { ensureAuthenticated } from './router.js';
import { logError, logInfo } from './logger';
import {
    getToken,
    requestAzureOboToken,
    parseAzureUserToken,
    validateAzureToken,
} from '@navikt/oasis';
import { konfigurerMetrikker } from './felles/metrikker';
import { prometheusTellere } from './metrikker';
import headers from './felles/headers';
import {
    handleLoginLokalt,
    handleCallbackLokalt,
    handleLogoutLokalt,
    sørgForAutentiseringLokalt,
    Saksbehandler,
} from './authLokalt.js';

const port = 8000;

interface Bruker {
    displayName: string;
    email: string;
    identifier: string;
    navIdent: string;
    groups: string[];
}

const hentBrukerFraGraph = async (token: string): Promise<Bruker | null> => {
    const obo = await requestAzureOboToken(token, graphApiScope);
    if (!obo.ok) {
        logError('Kunne ikke hente OBO-token for Graph API', new Error(obo.error.message));
        return null;
    }

    const query = 'onPremisesSamAccountName,displayName,mail,officeLocation,userPrincipalName,id';
    const graphUrl = `${graphApiUrl}?$select=${query}`;

    const response = await fetch(graphUrl, {
        headers: {
            Authorization: `Bearer ${obo.token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        logError(
            'Feil ved henting av brukerdata fra Graph',
            new Error(`Status: ${response.status}`)
        );
        return null;
    }

    const data = await response.json();
    const parsed = parseAzureUserToken(token);
    const groups = parsed.ok ? (parsed.groups ?? []) : [];

    return {
        displayName: data.displayName,
        email: data.userPrincipalName,
        identifier: data.userPrincipalName,
        navIdent: data.onPremisesSamAccountName,
        groups,
    };
};

const mapSaksbehandlerTilBruker = (saksbehandler: Saksbehandler): Bruker => ({
    displayName: saksbehandler.displayName,
    email: saksbehandler.email,
    identifier: saksbehandler.email,
    navIdent: saksbehandler.navIdent,
    groups: saksbehandler.groups,
});

export interface ServerApp {
    app: Express;
    router: Router;
}

export const createApp = (): ServerApp => {
    const app = express();
    const router = express.Router();

    headers.setup(app);

    if (erLokalUtvikling) {
        app.use(
            session({
                secret: process.env.SESSION_SECRET || 'lokal-secret',
                resave: false,
                saveUninitialized: false,
                cookie: {
                    secure: false,
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                },
            })
        );
    }

    app.get('/isAlive', (_req: Request, res: Response) => res.status(200).end());
    app.get('/isReady', (_req: Request, res: Response) => res.status(200).end());

    konfigurerMetrikker(app, prometheusTellere);

    if (erLokalUtvikling) {
        app.get('/oauth2/login', handleLoginLokalt);
        app.get('/oauth2/callback', handleCallbackLokalt);
        app.get('/oauth2/logout', handleLogoutLokalt);
        app.use(sørgForAutentiseringLokalt());
    }

    app.use(
        '/familie-ef-sak/api',
        addRequestInfo(),
        ensureAuthenticated(),
        attachToken(),
        doProxy(sakProxyUrl)
    );

    app.use(
        '/dokument',
        addRequestInfo(),
        ensureAuthenticated(),
        attachToken(),
        doProxy(sakProxyUrl)
    );

    app.use('/familie-brev/api', addRequestInfo(), ensureAuthenticated(), doProxy(brevProxyUrl));

    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

    app.get('/user/profile', async (req: Request, res: Response) => {
        if (erLokalUtvikling) {
            if (req.session?.user) {
                return res.status(200).json(mapSaksbehandlerTilBruker(req.session.user));
            }
            return res.status(401).json({ error: 'Ikke innlogget' });
        }

        const token = getToken(req);
        if (!token) {
            return res.status(401).json({ error: 'Ikke innlogget' });
        }

        const validation = await validateAzureToken(token);
        if (!validation.ok) {
            return res.status(401).json({ error: 'Ugyldig token' });
        }

        const bruker = await hentBrukerFraGraph(token);
        if (!bruker) {
            return res.status(500).json({ error: 'Kunne ikke hente brukerdata' });
        }

        return res.status(200).json(bruker);
    });

    app.get('/auth/logout', (_req: Request, res: Response) => {
        if (erLokalUtvikling) {
            return res.redirect('/oauth2/logout');
        }
        res.redirect('/oauth2/logout');
    });

    return { app, router };
};

export const setupRouterAndListen = ({ app, router }: ServerApp) => {
    app.use('/', setupRouter(router));

    app.listen(port, '0.0.0.0', () => {
        logInfo(`Server startet på port ${port}. Build version: ${process.env.APP_VERSION}.`);
    }).on('error', (err: Error) => {
        logError('Server startup failed', err);
    });
};
