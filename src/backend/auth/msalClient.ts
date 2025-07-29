import { ConfidentialClientApplication } from '@azure/msal-node';

export const createMsalClient = () => {
    return new ConfidentialClientApplication({
        auth: {
            clientId: process.env.CLIENT_ID!,
            authority: process.env.AZURE_AUTHORITY_URL!,
            clientSecret: process.env.CLIENT_SECRET!,
        },
    });
};
