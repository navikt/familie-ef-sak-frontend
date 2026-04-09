import './konfigurerApp.js';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { createApp, setupRouterAndListen } from './server-felles.js';

if (process.env.NODE_ENV !== 'development') {
    throw Error('Kan ikke starte lokal-server i produksjonsmiljø');
}

const startServer = async () => {
    const serverApp = createApp();

    const vite = await createViteServer({
        server: { middlewareMode: true },
        root: path.resolve(process.cwd(), 'src/frontend'),
        appType: 'custom',
    });

    serverApp.app.locals.vite = vite;
    serverApp.app.use((req, res, next) => {
        if (req.url.startsWith('/.well-known')) {
            res.status(404).end();
            return;
        }
        next();
    });
    serverApp.app.use(vite.middlewares);

    setupRouterAndListen(serverApp);
};

startServer();
