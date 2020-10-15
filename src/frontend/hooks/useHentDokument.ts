import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { OrNothing } from './felles/useSorteringState';

export const useHentDokument = (journalpostIdParam: OrNothing<string>) => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [valgtDokument, settValgtDokument] = useState<Ressurs<string>>(byggTomRessurs());

    const hentDokument = useCallback(
        (dokumentInfoId) => {
            settValgtDokument(byggHenterRessurs());
            axiosRequest<string, null>(
                {
                    method: 'GET',
                    url: `/familie-ef-sak/api/journalpost/${journalpostIdParam}/dokument/${dokumentInfoId}`,
                },
                innloggetSaksbehandler
            ).then((res: Ressurs<string>) => settValgtDokument(res));
        },
        [journalpostIdParam]
    );

    return {
        hentDokument,
        valgtDokument,
        settValgtDokument,
    };
};
