import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { Klagebehandlinger } from '../typer/klage';

interface IProps {
    hentKlagebehandlinger: (fagsakPersonId: string) => void;
    klagebehandlinger: Ressurs<Klagebehandlinger>;
}

export const useHentKlagebehandlinger = (): IProps => {
    const { axiosRequest } = useApp();
    const [klagebehandlinger, settKlagebehandlinger] = useState<Ressurs<Klagebehandlinger>>(
        byggTomRessurs()
    );

    const hentKlagebehandlinger = useCallback(
        (fagsakPersonid: string) => {
            settKlagebehandlinger(byggHenterRessurs());
            axiosRequest<Klagebehandlinger, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/klage/fagsak-person/${fagsakPersonid}`,
            }).then((res: Ressurs<Klagebehandlinger>) => settKlagebehandlinger(res));
        },
        [axiosRequest]
    );

    return {
        hentKlagebehandlinger,
        klagebehandlinger,
    };
};
