import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { Dokumentinfo } from '../typer/dokument';
import { VedleggRequest } from '../../Komponenter/Personoversikt/vedleggRequest';

export interface DokumenterInterface {
    hentDokumenterCallback: (request: VedleggRequest) => void;
    dokumenter: Ressurs<Dokumentinfo[]>;
}

export const useHentDokumenter = (): DokumenterInterface => {
    const { axiosRequest } = useApp();
    const [dokumenter, settDokumenter] = useState<Ressurs<Dokumentinfo[]>>(byggTomRessurs());

    const hentDokumenterCallback = useCallback(
        (request: VedleggRequest) => {
            settDokumenter(byggHenterRessurs());
            axiosRequest<Dokumentinfo[], VedleggRequest>({
                method: 'POST',
                url: `/familie-ef-sak/api/vedlegg/fagsak-person`,
                data: request,
            }).then((res: Ressurs<Dokumentinfo[]>) => settDokumenter(res));
        },
        [axiosRequest]
    );

    return {
        dokumenter,
        hentDokumenterCallback,
    };
};
