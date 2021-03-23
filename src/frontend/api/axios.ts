import { captureException, configureScope, withScope } from '@sentry/core';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { ISaksbehandler } from '../typer/saksbehandler';
import { slackKanaler } from '../typer/slack';

axios.defaults.baseURL = window.location.origin;
export const preferredAxios = axios;

const errorMessage = (frontendFeilmelding: string, headers?: any) => {
    const location = window.location.href;
    const callId = headers?.['nav-call-id'];
    return `${frontendFeilmelding} (url=${location} callId=${callId})`;
};

export const håndterRessurs = <T>(
    ressurs: Ressurs<T>,
    innloggetSaksbehandler?: ISaksbehandler,
    headers?: any
): RessursSuksess<T> | RessursFeilet => {
    let typetRessurs: Ressurs<T>;

    switch (ressurs.status) {
        case RessursStatus.SUKSESS:
            typetRessurs = {
                data: ressurs.data,
                status: RessursStatus.SUKSESS,
            };
            break;
        case RessursStatus.IKKE_TILGANG:
            loggFeil(undefined, innloggetSaksbehandler, ressurs.melding);
            typetRessurs = {
                melding: ressurs.melding,
                frontendFeilmelding: errorMessage(ressurs.frontendFeilmelding, headers),
                status: RessursStatus.IKKE_TILGANG,
            };
            break;
        case RessursStatus.FEILET:
            loggFeil(undefined, innloggetSaksbehandler, ressurs.melding);
            typetRessurs = {
                errorMelding: ressurs.errorMelding,
                melding: ressurs.melding,
                frontendFeilmelding: errorMessage(ressurs.frontendFeilmelding, headers),
                status: RessursStatus.FEILET,
            };
            break;
        case RessursStatus.FUNKSJONELL_FEIL:
            typetRessurs = {
                melding: ressurs.melding,
                frontendFeilmelding: errorMessage(ressurs.frontendFeilmelding, headers),
                status: RessursStatus.FUNKSJONELL_FEIL,
            };
            break;
        default:
            typetRessurs = {
                melding: 'Mest sannsynlig ukjent api feil',
                frontendFeilmelding: errorMessage('Mest sannsynlig ukjent api feil', headers),
                status: RessursStatus.FEILET,
            };
            break;
    }

    return typetRessurs;
};

export const loggFeil = (
    error?: AxiosError,
    innloggetSaksbehandler?: ISaksbehandler,
    feilmelding?: string
): void => {
    if (process.env.NODE_ENV === 'development') {
        configureScope((scope) => {
            scope.setUser({
                username: innloggetSaksbehandler
                    ? innloggetSaksbehandler.displayName
                    : 'Ukjent bruker',
            });
        });

        const response: AxiosResponse | undefined = error ? error.response : undefined;
        if (response) {
            withScope((scope) => {
                scope.setExtra('nav-call-id', response.headers['nav-call-id']);
                scope.setExtra('status text', response.statusText);
                scope.setExtra('status', response.status);

                captureException(error);
            });
        }

        apiLoggFeil(
            `${error ? `${error}${feilmelding ? ' - ' : ''}` : ''}${
                feilmelding ? `Feilmelding: ${feilmelding}` : ''
            }`
        );

        slackNotify(
            `En feil har oppstått i alene med barn vedtaksløsning!${
                error ? `\n*Error*: ${error}` : ''
            }${feilmelding ? `\n*Feilmelding:* ${feilmelding}` : ''}`,
            slackKanaler.alert
        );
    }
};

export const slackNotify = (melding: string, kanal: string): void => {
    preferredAxios.post(`/slack/notify/${kanal}`, {
        melding,
    });
};

export const apiLoggFeil = (melding: string): void => {
    preferredAxios.post('/logg-feil', {
        melding,
    });
};
