import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IPersonopplysninger } from '../typer/personopplysninger';

export const useHentPersonopplysninger = () => {
    const { axiosRequest } = useApp();
    const [personopplysningerResponse, settPersonopplysningerResponse] = useState<
        Ressurs<IPersonopplysninger>
    >(byggTomRessurs());

    const hentPersonopplysninger = useCallback((personIdent: string) => {
        settPersonopplysningerResponse(byggHenterRessurs());
        axiosRequest<IPersonopplysninger, { personIdent: string }>({
            method: 'POST',
            url: `/familie-ef-sak/api/personopplysninger/dummy`,
            data: { personIdent },
        }).then((res: Ressurs<IPersonopplysninger>) => settPersonopplysningerResponse(res));
    }, []);

    return {
        hentPersonopplysninger,
        personopplysningerResponse,
    };
};
