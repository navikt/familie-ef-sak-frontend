import dotenv from 'dotenv';
dotenv.config();

// felles-backend bruker andre variabler enn det som blir satt opp av azureAd
const settAzureAdPropsFraEnv = () => {
    process.env.AAD_DISCOVERY_URL = process.env.AZURE_APP_WELL_KNOWN_URL;
    process.env.CLIENT_ID = process.env.AZURE_APP_CLIENT_ID;
    process.env.CLIENT_SECRET = process.env.AZURE_APP_CLIENT_SECRET;
};

const konfigurerAzure = () => {
    const host = 'ensligmorellerfar';
    const callbackPath = '/auth/openid/callback';
    switch (process.env.ENV) {
        case 'local':
            process.env.AAD_LOGOUT_REDIRECT_URL = `https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=http:\\\\localhost:8000`;
            process.env.AAD_REDIRECT_URL = `http://localhost:8000${callbackPath}`;
            process.env.AAD_DISCOVERY_URL = `https://login.microsoftonline.com/navq.onmicrosoft.com/v2.0/.well-known/openid-configuration`;
            break;
        case 'e2e':
            process.env.AAD_LOGOUT_REDIRECT_URL = `http://host.docker.internal:1111/v2.0/logout?post_logout_redirect_uri=http:\\\\localhost:8000`;
            process.env.AAD_REDIRECT_URL = `http://host.docker.internal:8000${callbackPath}`;
            process.env.AAD_DISCOVERY_URL = `http://host.docker.internal:1111/v2.0/.well-known/openid-configuration`;
            break;
        case 'preprod':
            process.env.AAD_LOGOUT_REDIRECT_URL = `https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=https:\\\\${host}.dev.intern.nav.no`;
            process.env.AAD_REDIRECT_URL = `https://${host}.dev.intern.nav.no${callbackPath}`;
            settAzureAdPropsFraEnv();
            break;
        case 'production':
            process.env.AAD_LOGOUT_REDIRECT_URL = `https://login.microsoftonline.com/navno.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=https:\\\\${host}.intern.nav.no`;
            process.env.AAD_REDIRECT_URL = `https://${host}.intern.nav.no${callbackPath}`;
            settAzureAdPropsFraEnv();
            break;
        default:
            break;
    }
};

konfigurerAzure();
