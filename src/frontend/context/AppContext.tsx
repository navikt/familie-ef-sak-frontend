import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useEffect } from 'react';

import { håndterRessurs, loggFeil, preferredAxios } from '../api/axios';
import { Ressurs } from '../typer/ressurs';
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
    const axiosRequest = async <T, D>(
        config: AxiosRequestConfig & { data?: D },
        innloggetSaksbehandler?: ISaksbehandler
    ): Promise<Ressurs<T>> => {
        return preferredAxios
            .request(config)
            .then((response: AxiosResponse<Ressurs<T>>) => {
                const responsRessurs: Ressurs<T> = response.data;
                return håndterRessurs(responsRessurs, innloggetSaksbehandler);
            })
            .catch((error: AxiosError) => {
                if (error.message.includes('401')) {
                    settAutentisert(false);
                }
                loggFeil(error, innloggetSaksbehandler);

                const responsRessurs: Ressurs<T> = error.response?.data;
                return håndterRessurs(responsRessurs, innloggetSaksbehandler);
            });
    };

    return {
        axiosRequest,
        autentisert,
        innloggetSaksbehandler,
    };
});

export { AppProvider, useApp };
