import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

import { håndterFeil, håndterRessurs, preferredAxios } from '../api/axios';
import { Ressurs, RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { ISaksbehandler } from '../typer/saksbehandler';
import constate from 'constate';
import { EToast } from '../typer/toast';
import { AppEnv } from '../api/env';
import { AxiosRequestCallback } from '../typer/axiosRequest';
import { harTilgangTilRolle } from '../utils/roller';

interface IProps {
    autentisertSaksbehandler: ISaksbehandler;
    appEnv: AppEnv;
}

const [AppProvider, useApp] = constate(({ autentisertSaksbehandler, appEnv }: IProps) => {
    const [autentisert, settAutentisert] = React.useState(true);
    const [erSaksbehandler, settErSaksbehandler] = React.useState(
        harTilgangTilRolle(appEnv, autentisertSaksbehandler, 'saksbehandler')
    );
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] =
        React.useState(autentisertSaksbehandler);
    const [ikkePersisterteKomponenter, settIkkePersisterteKomponenter] = useState<Set<string>>(
        new Set()
    );
    const [ulagretData, settUlagretData] = useState<boolean>(ikkePersisterteKomponenter.size > 0);
    const [valgtSide, settValgtSide] = useState<string | undefined>();
    const [visUlagretDataModal, settVisUlagretDataModal] = useState(false);
    const [byttUrl, settByttUrl] = useState(false);
    const [toast, settToast] = useState<EToast | undefined>();
    const [valgtFagsakId, settValgtFagsakId] = useState<string>();
    const [valgtFagsakPersonId, settValgtFagsakPersonId] = useState<string>();

    useEffect(
        () => settUlagretData(ikkePersisterteKomponenter.size > 0),
        [ikkePersisterteKomponenter]
    );

    useEffect(() => {
        settInnloggetSaksbehandler(autentisertSaksbehandler);
    }, [autentisertSaksbehandler]);

    useEffect(() => {
        settErSaksbehandler(harTilgangTilRolle(appEnv, innloggetSaksbehandler, 'saksbehandler'));
    }, [innloggetSaksbehandler, appEnv]);

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

    const axiosRequest: AxiosRequestCallback = useCallback(
        <RES, REQ>(
            config: AxiosRequestConfig<REQ>
        ): Promise<RessursFeilet | RessursSuksess<RES>> => {
            return preferredAxios
                .request<Ressurs<RES>>(config)
                .then((response: AxiosResponse<Ressurs<RES>>) => {
                    const responsRessurs: Ressurs<RES> = response.data;
                    return håndterRessurs(responsRessurs, innloggetSaksbehandler, response.headers);
                })
                .catch((error: AxiosError<Ressurs<RES>>) => {
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
        toast,
        settToast,
        appEnv,
        valgtFagsakId,
        settValgtFagsakId,
        valgtFagsakPersonId,
        settValgtFagsakPersonId,
        erSaksbehandler,
    };
});

export { AppProvider, useApp };
