import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { IJournalpost } from '../typer/journalføring';

export interface HentDokumentResponse {
    hentDokument: (dokumentinfoId: string) => void;
    valgtDokument: Ressurs<string>;
    hentFørsteDokument: () => void;
}

export const useHentDokument = (journalpost: IJournalpost): HentDokumentResponse => {
    const { axiosRequest } = useApp();
    const [valgtDokument, settValgtDokument] = useState<Ressurs<string>>(byggTomRessurs());
    const hentDokument = useCallback(
        (dokumentInfoId: string) => {
            settValgtDokument(byggHenterRessurs());
            axiosRequest<string, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/journalpost/${journalpost.journalpostId}/dokument/${dokumentInfoId}`,
            }).then((res: Ressurs<string>) => settValgtDokument(res));
        },
        [axiosRequest, journalpost.journalpostId]
    );

    const hentDokumentForIndex = useCallback(
        (index: number) => {
            if (journalpost.dokumenter && journalpost.dokumenter.length > index) {
                hentDokument(journalpost.dokumenter[index].dokumentInfoId);
            }
        },
        [hentDokument, journalpost]
    );

    const hentFørsteDokument = useCallback(() => {
        hentDokumentForIndex(0);
    }, [hentDokumentForIndex]);

    return {
        hentDokument,
        valgtDokument,
        hentFørsteDokument,
    };
};
