import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { IJournalpost } from '../typer/journalføring';

export interface HentDokumentResponse {
    hentDokument: (dokumentinfoId: string) => void;
    valgtDokument: Ressurs<string>;
    hentFørsteDokument: () => void;
    hentNesteDokument: () => void;
    hentForrigeDokument: () => void;
}

export const useHentDokument = (journalpost: IJournalpost): HentDokumentResponse => {
    const { axiosRequest } = useApp();
    const [valgtDokument, settValgtDokument] = useState<Ressurs<string>>(byggTomRessurs());
    const [valgtDokumentInfoId, settDokumentInfoId] = useState<string | undefined>();
    const hentDokument = useCallback(
        (dokumentInfoId: string) => {
            settDokumentInfoId(dokumentInfoId);
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

    const indeksForValgtDokument = useCallback(() => {
        return journalpost.dokumenter.findIndex(
            (dok) => dok.dokumentInfoId === valgtDokumentInfoId
        );
    }, [journalpost, valgtDokumentInfoId]);

    const hentNesteDokument = useCallback(() => {
        const nesteEllerFørsteIndeks =
            (indeksForValgtDokument() + 1) % journalpost.dokumenter.length;
        hentDokumentForIndex(nesteEllerFørsteIndeks);
    }, [hentDokumentForIndex, indeksForValgtDokument, journalpost]);

    const hentForrigeDokument = useCallback(() => {
        const forrigeEllerSisteIndeks =
            (indeksForValgtDokument() - 1 + journalpost.dokumenter.length) %
            journalpost.dokumenter.length;
        hentDokumentForIndex(forrigeEllerSisteIndeks);
    }, [hentDokumentForIndex, indeksForValgtDokument, journalpost]);

    return {
        hentDokument,
        valgtDokument,
        hentFørsteDokument,
        hentNesteDokument,
        hentForrigeDokument,
    };
};
