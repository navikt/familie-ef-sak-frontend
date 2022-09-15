import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggSuksessRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { Klagebehandlinger } from '../typer/klage';
import { useToggles } from '../context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';

interface IProps {
    hentKlagebehandlinger: (fagsakPersonId: string) => void;
    klagebehandlinger: Ressurs<Klagebehandlinger>;
}

export const useHentKlagebehandlinger = (): IProps => {
    const { axiosRequest } = useApp();
    const [klagebehandlinger, settKlagebehandlinger] = useState<Ressurs<Klagebehandlinger>>(
        byggTomRessurs()
    );
    const { toggles } = useToggles();
    const hentKlagebehandlinger = useCallback(
        (fagsakPersonid: string) => {
            if (toggles[ToggleName.visOpprettKlage]) {
                settKlagebehandlinger(byggHenterRessurs());
                axiosRequest<Klagebehandlinger, null>({
                    method: 'GET',
                    url: `/familie-ef-sak/api/klage/fagsak-person/${fagsakPersonid}`,
                }).then((res: Ressurs<Klagebehandlinger>) => settKlagebehandlinger(res));
            } else {
                const tomKlagebehandlinger = {
                    overgangsstønad: [],
                    barnetilsyn: [],
                    skolepenger: [],
                };
                settKlagebehandlinger(byggSuksessRessurs(tomKlagebehandlinger));
            }
        },
        [axiosRequest, toggles]
    );
    return {
        hentKlagebehandlinger,
        klagebehandlinger,
    };
};
