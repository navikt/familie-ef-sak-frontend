import { captureException, withScope, getCurrentScope } from '@sentry/core';
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { ISaksbehandler } from '../typer/saksbehandler';

axios.defaults.baseURL = window.location.origin;
export const preferredAxios = axios;

// eslint-disable-next-line
const errorMessage = (frontendFeilmelding: string, headers?: any) => {
    const callId = headers?.['nav-call-id'];
    return `${frontendFeilmelding} \n\nFeilkode: ${callId}`;
};

const lagUkjentFeilRessurs = (headers?: Headers): RessursFeilet => ({
    melding: 'Mest sannsynlig ukjent api feil',
    frontendFeilmelding: errorMessage('Mest sannsynlig ukjent api feil', headers),
    frontendFeilmeldingUtenFeilkode: 'Mest sannsynlig ukjent api feil',
    status: RessursStatus.FEILET,
});

export const håndterFeil = <T>(
    error: AxiosError<Ressurs<T>>,
    innloggetSaksbehandler?: ISaksbehandler
): RessursSuksess<T> | RessursFeilet => {
    const headers = error.response?.headers;
    if (!error.response?.data.status) {
        const requestId = error.config?.headers?.['x-request-id'];
        loggFeil(
            error,
            innloggetSaksbehandler,
            `Savner body/status i response - Url: ${window.location.href} - Prøvde å kalle ${error.config?.url} (${error.config?.method}) requestId=${requestId}`,
            headers,
            true
        );
        return lagUkjentFeilRessurs(headers);
    }
    const responsRessurs: Ressurs<T> = error.response?.data;

    return håndterRessurs(responsRessurs, innloggetSaksbehandler, headers);
};

export const håndterRessurs = <T>(
    ressurs: Ressurs<T>,
    innloggetSaksbehandler?: ISaksbehandler,
    headers?: Headers
): RessursSuksess<T> | RessursFeilet => {
    let typetRessurs: Ressurs<T>;
    const gjeldendeUrl = window.location.href;

    switch (ressurs.status) {
        case RessursStatus.SUKSESS:
            typetRessurs = {
                data: ressurs.data,
                status: RessursStatus.SUKSESS,
            };
            break;
        case RessursStatus.IKKE_TILGANG:
            loggFeil(
                undefined,
                innloggetSaksbehandler,
                `Feilmelding: ${ressurs.melding} - Url: ${gjeldendeUrl}`,
                headers,
                true
            );
            typetRessurs = {
                melding: ressurs.melding,
                frontendFeilmelding: ressurs.frontendFeilmelding,
                frontendFeilmeldingUtenFeilkode: ressurs.frontendFeilmelding,
                status: RessursStatus.IKKE_TILGANG,
            };
            break;
        case RessursStatus.FEILET:
            loggFeil(
                undefined,
                innloggetSaksbehandler,
                `Feilmelding: ${ressurs.melding} / Feilmelding til saksbehandler: ${ressurs.frontendFeilmelding} - Url: ${gjeldendeUrl}`,
                headers
            );
            typetRessurs = {
                errorMelding: ressurs.errorMelding,
                melding: ressurs.melding,
                frontendFeilmelding: errorMessage(ressurs.frontendFeilmelding, headers),
                frontendFeilmeldingUtenFeilkode: ressurs.frontendFeilmelding,
                status: RessursStatus.FEILET,
            };
            break;
        case RessursStatus.FUNKSJONELL_FEIL:
            typetRessurs = {
                melding: ressurs.melding,
                frontendFeilmelding: errorMessage(ressurs.frontendFeilmelding, headers),
                frontendFeilmeldingUtenFeilkode: ressurs.frontendFeilmelding,
                status: RessursStatus.FUNKSJONELL_FEIL,
            };
            break;
        default:
            loggFeil(
                undefined,
                innloggetSaksbehandler,
                `Ukjent feil status=${ressurs.status} - Url: ${gjeldendeUrl}`,
                headers
            );
            typetRessurs = lagUkjentFeilRessurs(headers);
            break;
    }

    return typetRessurs;
};

export const loggFeil = (
    error?: AxiosError,
    innloggetSaksbehandler?: ISaksbehandler,
    feilmelding?: string,
    headers?: Headers,
    isWarning = false
): void => {
    if (process.env.NODE_ENV === 'production') {
        getCurrentScope().setUser({
            username: innloggetSaksbehandler ? innloggetSaksbehandler.displayName : 'Ukjent bruker',
        });

        const response: AxiosResponse | undefined = error ? error.response : undefined;
        withScope((scope) => {
            if (response) {
                scope.setExtra('nav-call-id', response.headers['nav-call-id']);
                scope.setExtra('status text', response.statusText);
                scope.setExtra('status', response.status);
            }

            captureException(error);
        });

        apiLoggFeil(
            `${error ? `${error}${feilmelding ? ' - ' : ''}` : ''}${
                feilmelding ? `Feilmelding: ${feilmelding}` : ''
            }`,
            headers,
            isWarning
        );
    }
};

export const apiLoggFeil = (melding: string, headers?: Headers, isWarning = false): void => {
    const callId = headers?.['nav-call-id'];
    preferredAxios.post(
        '/logg-feil',
        {
            melding,
            ...(isWarning && { isWarning }),
        },
        {
            headers: {
                ...((callId && { 'nav-call-id': callId }) as Headers),
            } as AxiosRequestHeaders,
        }
    );
};

type Headers = Record<string, unknown>;
