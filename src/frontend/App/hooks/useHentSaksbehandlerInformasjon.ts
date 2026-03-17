import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { RessursStatus } from '../typer/ressurs';

interface SaksbehandlerInformasjonResponse {
    azureId: string;
    navIdent: string;
    fornavn: string;
    etternavn: string;
    enhet: string;
    enhetsnavn: string;
}

export const useHentSaksbehandlerInformasjon = (navIdent: string | undefined) => {
    const { axiosRequest } = useApp();
    const [saksbehandlerInformasjon, settSaksbehandlerInformasjon] =
        useState<SaksbehandlerInformasjonResponse>();

    const hentSaksbehandlerInformasjon = () => {
        axiosRequest<SaksbehandlerInformasjonResponse, undefined>({
            method: 'GET',
            url: `/familie-ef-sak/api/saksbehandler/saksbehandler-informasjon`,
        }).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                settSaksbehandlerInformasjon(res.data);
            }
        });
    };

    useEffect(() => {
        if (navIdent) {
            hentSaksbehandlerInformasjon();
        }
    }, [navIdent]);

    return { saksbehandlerInformasjon };
};
