import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '/var/run/secrets/nais.io/vault/.env' });
} else {
    dotenv.config();
}

const konfigurerAzure = () => {
    const host = 'ensligmorellerfar';
    switch (process.env.ENV) {
        case 'local':
            process.env.AAD_LOGOUT_REDIRECT_URL = `https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=http:\\\\localhost:8000`;
            process.env.AAD_REDIRECT_URL = 'http://localhost:8000/auth/openid/callback';
            process.env.AAD_DISCOVERY_URL = `https://login.microsoftonline.com/navq.onmicrosoft.com/v2.0/.well-known/openid-configuration`;
            break;
        case 'e2e':
            process.env.AAD_LOGOUT_REDIRECT_URL = `http://host.docker.internal:1111/v2.0/logout?post_logout_redirect_uri=http:\\\\localhost:8000`;
            process.env.AAD_REDIRECT_URL = 'http://host.docker.internal:8000/auth/openid/callback';
            process.env.AAD_DISCOVERY_URL = `http://host.docker.internal:1111/v2.0/.well-known/openid-configuration`;
            break;
        case 'preprod':
            process.env.AAD_LOGOUT_REDIRECT_URL = `https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=https:\\\\${host}.dev.intern.nav.no`;
            process.env.AAD_REDIRECT_URL = `https://${host}.dev.intern.nav.no/auth/openid/callback`;
            process.env.AAD_DISCOVERY_URL = process.env.AZURE_APP_WELL_KNOWN_URL;
            break;
        case 'production':
            process.env.AAD_LOGOUT_REDIRECT_URL = `https://login.microsoftonline.com/navno.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=https:\\\\${host}.intern.nav.no`;
            process.env.AAD_REDIRECT_URL = `https://${host}.intern.nav.no/auth/openid/callback`;
            process.env.AAD_DISCOVERY_URL = process.env.AZURE_APP_WELL_KNOWN_URL;
            break;
        default:
            break;
    }
};

konfigurerAzure();
