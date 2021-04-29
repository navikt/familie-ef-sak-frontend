import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { INavKontor } from '../typer/personopplysninger';

export const useHentNavKontor = (
    behandlingId: string
): {
    hentNavKontor: (behandlingsid: string) => void;
    navKontorResponse: Ressurs<INavKontor>;
} => {
    const { axiosRequest } = useApp();
    const [navKontorResponse, settNavKontorResponse] = useState<Ressurs<INavKontor>>(
        byggTomRessurs()
    );

    const hentNavKontor = useCallback(() => {
        settNavKontorResponse(byggHenterRessurs());
        axiosRequest<INavKontor, { behandlingId: string }>({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/nav-kontor/behandling/${behandlingId}`,
        }).then((res: Ressurs<INavKontor>) => settNavKontorResponse(res));
    }, [behandlingId, axiosRequest]);

    return {
        hentNavKontor,
        navKontorResponse,
    };
};
