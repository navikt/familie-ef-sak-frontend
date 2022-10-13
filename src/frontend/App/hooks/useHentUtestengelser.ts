import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { IUtestengelse } from '../typer/utestengelse';

interface IProps {
    hentUtestengelser: (fagsakPersonId: string) => void;
    utestengelser: Ressurs<IUtestengelse[]>;
}

export const useHentUtestengelser = (): IProps => {
    const { axiosRequest } = useApp();
    const [utestengelser, settUtestengelser] = useState<Ressurs<IUtestengelse[]>>(byggTomRessurs());
    const hentUtestengelser = useCallback(
        (fagsakPersonId: string) => {
            settUtestengelser(byggHenterRessurs());
            axiosRequest<IUtestengelse[], null>({
                method: 'GET',
                url: `/familie-ef-sak/api/utestengelse/${fagsakPersonId}`,
            }).then(settUtestengelser);
        },
        [axiosRequest]
    );
    return {
        hentUtestengelser,
        utestengelser,
    };
};
