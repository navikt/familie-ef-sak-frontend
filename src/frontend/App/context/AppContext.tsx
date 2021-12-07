import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

import { håndterFeil, håndterRessurs, preferredAxios } from '../api/axios';
import { Ressurs, RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { ISaksbehandler } from '../typer/saksbehandler';
import constate from 'constate';
import { AppEnv } from '../api/env';

interface IProps {
    autentisertSaksbehandler: ISaksbehandler;
    appEnv: AppEnv;
}

const [AppProvider, useApp] = constate(({ autentisertSaksbehandler, appEnv }: IProps) => {
    const [autentisert, settAutentisert] = React.useState(true);
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] =
        React.useState(autentisertSaksbehandler);
    const [ikkePersisterteKomponenter, settIkkePersisterteKomponenter] = useState<Set<string>>(
        new Set()
    );
    const [ulagretData, settUlagretData] = useState<boolean>(ikkePersisterteKomponenter.size > 0);
    const [valgtSide, settValgtSide] = useState<string | undefined>();
    const [visUlagretDataModal, settVisUlagretDataModal] = useState(false);
    const [byttUrl, settByttUrl] = useState(false);
    const [valgtPersonIdent, settValgtPersonIdent] = useState<string>();

    useEffect(
        () => settUlagretData(ikkePersisterteKomponenter.size > 0),
        [ikkePersisterteKomponenter]
    );

    useEffect(() => {
        settInnloggetSaksbehandler(autentisertSaksbehandler);
    }, [autentisertSaksbehandler]);

    const settIkkePersistertKomponent = (komponentId: string) => {
        if (ikkePersisterteKomponenter.has(komponentId)) return;

        settIkkePersisterteKomponenter(new Set(ikkePersisterteKomponenter).add(komponentId));
    };

    const nullstillIkkePersistertKomponent = (komponentId: string) => {
        const kopi = new Set(ikkePersisterteKomponenter);
        kopi.delete(komponentId);
        settIkkePersisterteKomponenter(kopi);
    };

    const nullstillIkkePersisterteKomponenter = () => {
        settIkkePersisterteKomponenter(new Set());
    };

    const gåTilUrl = (url: string) => {
        if (ulagretData) {
            settValgtSide(url);
            settVisUlagretDataModal(true);
        } else {
            settValgtSide(url);
            settByttUrl(true);
        }
    };

    const axiosRequest = useCallback(
        <T, D>(
            config: AxiosRequestConfig & { data?: D }
        ): Promise<RessursFeilet | RessursSuksess<T>> => {
            return preferredAxios
                .request<Ressurs<T>>(config)
                .then((response: AxiosResponse<Ressurs<T>>) => {
                    const responsRessurs: Ressurs<T> = response.data;
                    return håndterRessurs(responsRessurs, innloggetSaksbehandler, response.headers);
                })
                .catch((error: AxiosError<Ressurs<T>>) => {
                    if (error.message.includes('401')) {
                        settAutentisert(false);
                    }
                    return håndterFeil(error, innloggetSaksbehandler);
                });
        },
        [innloggetSaksbehandler]
    );

    return {
        axiosRequest,
        autentisert,
        innloggetSaksbehandler,
        settIkkePersistertKomponent,
        nullstillIkkePersistertKomponent,
        nullstillIkkePersisterteKomponenter,
        gåTilUrl,
        valgtSide,
        visUlagretDataModal,
        settVisUlagretDataModal,
        byttUrl,
        settByttUrl,
        appEnv,
        valgtPersonIdent,
        settValgtPersonIdent,
    };
});

export { AppProvider, useApp };
