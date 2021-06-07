import { Counter } from 'prom-client';

export const prometheusTellere: { [key: string]: Counter<string> } = {
    appLoad: new Counter({
        help: 'Counter for times app has been loaded',
        labelNames: ['code'],
        name: 'app_load',
    }),
    errorRoute: new Counter({
        help: 'Counter for times error page is loaded',
        labelNames: ['code'],
        name: 'error_route',
    }),
    loginRoute: new Counter({
        help: 'Counter for times login route is requested',
        labelNames: ['code'],
        name: 'login_route',
    }),
};
