import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { byggTomRessurs, Ressurs, RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { ISaksbehandler } from '../typer/saksbehandler';

export const useHentInnloggetSaksbehandler = () => {
    const { axiosRequest } = useApp();
    const [saksbehandlerInfo, settSaksbehandlerInfo] =
        useState<Ressurs<ISaksbehandler>>(byggTomRessurs());

    const hentSaksbehandlerInfo = (): Promise<RessursFeilet | RessursSuksess<ISaksbehandler>> => {
        return axiosRequest<ISaksbehandler, string>({
            method: 'GET',
            url: `/familie-ef-sak/api/saksbehandler/saksbehandler-informasjon`,
        });
    };

    return { settSaksbehandlerInfo, saksbehandlerInfo, hentSaksbehandlerInfo };
};
