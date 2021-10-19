import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';

import { håndterFeil, håndterRessurs, preferredAxios } from '../api/axios';
import { Ressurs, RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { ISaksbehandler } from '../typer/saksbehandler';
import constate from 'constate';

interface IProps {
    autentisertSaksbehandler: ISaksbehandler | undefined;
}

const [AppProvider, useApp] = constate(({ autentisertSaksbehandler }: IProps) => {
    const [autentisert, settAutentisert] = React.useState(true);
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] =
        React.useState(autentisertSaksbehandler);
    const [ikkePersisterteKomponenter, settIkkePersisterteKomponenter] = useState<Set<string>>(
        new Set()
    );
    const [ulagretData, settUlagretData] = useState<boolean>(ikkePersisterteKomponenter.size > 0);
    const [gjeldendeLocation, settGjeldendeLocation] = useState<string | undefined>();
    const [valgtSide, settValgtSide] = useState<string | undefined>();
    const [visUlagretDataModal, settVisUlagretDataModal] = useState(false);
    const [byttUrl, settByttUrl] = useState(false);
    useEffect(
        () => settUlagretData(ikkePersisterteKomponenter.size > 0),
        [ikkePersisterteKomponenter]
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
    const settIkkePersistertKomponent = (komponentId: string) => {
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
        if (gjeldendeLocation === url) {
            return;
        } else if (ulagretData) {
            settValgtSide(url);
            settVisUlagretDataModal(true);
        } else {
            settValgtSide(url);
            settByttUrl(true);
        }
    };
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
        settGjeldendeLocation,
        settVisUlagretDataModal,
        byttUrl,
        settByttUrl,
    };
});

export { AppProvider, useApp };
