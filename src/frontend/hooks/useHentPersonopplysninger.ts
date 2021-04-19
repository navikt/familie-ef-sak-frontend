import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IPersonopplysninger } from '../typer/personopplysninger';

export const useHentPersonopplysninger = (
    behandlingId: string
): {
    hentPersonopplysninger: (behandlingsid: string) => void;
    personopplysningerResponse: Ressurs<IPersonopplysninger>;
} => {
    const { axiosRequest } = useApp();
    const [personopplysningerResponse, settPersonopplysningerResponse] = useState<
        Ressurs<IPersonopplysninger>
    >(byggTomRessurs());

    const hentPersonopplysninger = useCallback(() => {
        settPersonopplysningerResponse(byggHenterRessurs());
        axiosRequest<IPersonopplysninger, { behandlingId: string }>({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/behandling/${behandlingId}`,
        }).then((res: Ressurs<IPersonopplysninger>) => settPersonopplysningerResponse(res));
        // eslint-disable-next-line
    }, [behandlingId]);

    return {
        hentPersonopplysninger,
        personopplysningerResponse,
    };
};
