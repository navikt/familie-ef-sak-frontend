import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { INavEnhet } from '../typer/personopplysninger';

export const useHentNavKontor = (
    behandlingId: string
): {
    hentNavKontor: (behandlingsid: string) => void;
    navKontorResponse: Ressurs<INavEnhet>;
} => {
    const { axiosRequest } = useApp();
    const [navKontorResponse, settNavKontorResponse] = useState<Ressurs<INavEnhet>>(
        byggTomRessurs()
    );

    const hentNavKontor = useCallback(() => {
        settNavKontorResponse(byggHenterRessurs());
        axiosRequest<INavEnhet, { behandlingId: string }>({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/geografisk-tilknytning/behandling/${behandlingId}`,
        }).then((res: Ressurs<INavEnhet>) => settNavKontorResponse(res));
    }, [behandlingId]);

    return {
        hentNavKontor,
        navKontorResponse,
    };
};
