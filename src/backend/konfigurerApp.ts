import * as dotenv from 'dotenv';
dotenv.config();

// felles-backend bruker andre variabler enn det som blir satt opp av azureAd
const settAzureAdPropsFraEnv = () => {
    process.env.AAD_DISCOVERY_URL = process.env.AZURE_APP_WELL_KNOWN_URL;
    process.env.CLIENT_ID = process.env.AZURE_APP_CLIENT_ID;
    process.env.CLIENT_SECRET = process.env.AZURE_APP_CLIENT_SECRET;
};

const konfigurerAzure = () => {
    const host = 'ensligmorellerfar';
    switch (process.env.ENV) {
        case 'lokalt-mot-preprod':
        case 'local':
            process.env.AAD_LOGOUT_REDIRECT_URL = `https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=http:\\\\localhost:8000`;
            process.env.AAD_REDIRECT_URL = 'http://localhost:8000/auth/openid/callback';
            process.env.AAD_DISCOVERY_URL =
                process.env.AZURE_APP_WELL_KNOWN_URL ||
                `https://login.microsoftonline.com/navq.onmicrosoft.com/v2.0/.well-known/openid-configuration`;
            process.env.GRAPH_API = 'https://graph.microsoft.com/v1.0/me';
            break;
        case 'e2e':
            process.env.AAD_LOGOUT_REDIRECT_URL = `http://host.docker.internal:1111/v2.0/logout?post_logout_redirect_uri=http:\\\\localhost:8000`;
            process.env.AAD_REDIRECT_URL = 'http://host.docker.internal:8000/auth/openid/callback';
            process.env.AAD_DISCOVERY_URL = `http://host.docker.internal:1111/v2.0/.well-known/openid-configuration`;
            process.env.GRAPH_API = 'http://familie-mock-server:1337/graph/me';
            break;
        case 'preprod':
            process.env.AAD_LOGOUT_REDIRECT_URL = `https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=https:\\\\${host}.ansatt.dev.nav.no`;
            process.env.AAD_REDIRECT_URL = `https://${host}.ansatt.dev.nav.no/auth/openid/callback`;
            process.env.GRAPH_API = 'https://graph.microsoft.com/v1.0/me';
            settAzureAdPropsFraEnv();
            break;
        case 'production':
            process.env.AAD_LOGOUT_REDIRECT_URL = `https://login.microsoftonline.com/navno.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=https:\\\\${host}.intern.nav.no`;
            process.env.AAD_REDIRECT_URL = `https://${host}.intern.nav.no/auth/openid/callback`;
            process.env.GRAPH_API = 'https://graph.microsoft.com/v1.0/me';
            settAzureAdPropsFraEnv();
            break;
        default:
            break;
    }
};

konfigurerAzure();
