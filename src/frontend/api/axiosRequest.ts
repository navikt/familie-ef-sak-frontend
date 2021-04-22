import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Ressurs, RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { håndterRessurs, preferredAxios } from './axios';
import { ISaksbehandler } from '../typer/saksbehandler';

export const axiosRequest = <T, D>(
    config: AxiosRequestConfig & { data?: D },
    innloggetSaksbehandler?: ISaksbehandler
): Promise<RessursFeilet | RessursSuksess<T>> => {
    return preferredAxios
        .request(config)
        .then((response: AxiosResponse<Ressurs<T>>) => {
            const responsRessurs: Ressurs<T> = response.data;
            return håndterRessurs(responsRessurs, innloggetSaksbehandler, response.headers);
        })
        .catch((error: AxiosError) => {
            //TODO LAG ETT IKKE AUTTENTISERT FEIL?
            const responsRessurs: Ressurs<T> = error.response?.data;
            return håndterRessurs(responsRessurs, innloggetSaksbehandler, error.response?.headers);
        });
};
