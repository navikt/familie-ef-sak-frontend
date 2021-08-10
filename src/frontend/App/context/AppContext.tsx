import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useEffect } from 'react';

import { håndterFeil, håndterRessurs, preferredAxios } from '../api/axios';
import { Ressurs, RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { ISaksbehandler } from '../typer/saksbehandler';
import constate from 'constate';

interface IProps {
    autentisertSaksbehandler: ISaksbehandler | undefined;
}

const [AppProvider, useApp] = constate(({ autentisertSaksbehandler }: IProps) => {
    const [autentisert, settAutentisert] = React.useState(true);
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = React.useState(
        autentisertSaksbehandler
    );

    useEffect(() => {
        settInnloggetSaksbehandler(autentisertSaksbehandler);
    }, [autentisertSaksbehandler]);

    const axiosRequest = <T, D>(
        config: AxiosRequestConfig & { data?: D }
    ): Promise<RessursFeilet | RessursSuksess<T>> => {
        return preferredAxios
            .request(config)
            .then((response: AxiosResponse<Ressurs<T>>) => {
                const responsRessurs: Ressurs<T> = response.data;
                return håndterRessurs(responsRessurs, innloggetSaksbehandler, response.headers);
            })
            .catch((error: AxiosError) => {
                if (error.message.includes('401')) {
                    settAutentisert(false);
                }
                return håndterFeil(error, innloggetSaksbehandler);
            });
    };

    return {
        axiosRequest,
        autentisert,
        innloggetSaksbehandler,
    };
});

export { AppProvider, useApp };
