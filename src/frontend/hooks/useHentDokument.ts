import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { OrNothing } from './felles/useSorteringState';
import { IJournalpost } from '../typer/journalforing';

export const useHentDokument = (journalpostIdParam: OrNothing<string>) => {
    const { axiosRequest } = useApp();
    const [valgtDokument, settValgtDokument] = useState<Ressurs<string>>(byggTomRessurs());
    const [valgtDokumentInfoId, settDokumentInfoId] = useState<string | undefined>();
    const hentDokument = useCallback(
        (dokumentInfoId) => {
            settDokumentInfoId(dokumentInfoId);
            settValgtDokument(byggHenterRessurs());
            axiosRequest<string, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/journalpost/${journalpostIdParam}/dokument/${dokumentInfoId}`,
            }).then((res: Ressurs<string>) => settValgtDokument(res));
        },
        [journalpostIdParam]
    );

    const hentFørsteDokument = useCallback(
        (journalpost: IJournalpost) => {
            hentDokumentForIndex(journalpost, 0);
        },
        [journalpostIdParam]
    );

    const hentDokumentForIndex = useCallback(
        (journalpost: IJournalpost, index: number) => {
            if (journalpost.dokumenter && journalpost.dokumenter.length > index) {
                hentDokument(journalpost.dokumenter[index].dokumentInfoId);
            }
        },
        [journalpostIdParam]
    );

    const indeksForValgtDokument = useCallback(
        (journalpost: IJournalpost) => {
            return journalpost.dokumenter.findIndex(
                (dok) => dok.dokumentInfoId === valgtDokumentInfoId
            );
        },
        [valgtDokumentInfoId]
    );

    const hentNesteDokument = useCallback(
        (journalpost: IJournalpost) => {
            const nesteIndeks = indeksForValgtDokument(journalpost) + 1;
            const nesteEllerFørsteIndeks =
                journalpost.dokumenter.length > nesteIndeks ? nesteIndeks : 0;
            hentDokumentForIndex(journalpost, nesteEllerFørsteIndeks);
        },
        [journalpostIdParam, valgtDokumentInfoId]
    );

    const hentForrigeDokument = useCallback(
        (journalpost: IJournalpost) => {
            const forrigeIndeks = indeksForValgtDokument(journalpost) - 1;
            const forrigeEllerSisteIndeks =
                forrigeIndeks >= 0 ? forrigeIndeks : journalpost.dokumenter.length - 1;
            hentDokumentForIndex(journalpost, forrigeEllerSisteIndeks);
        },
        [journalpostIdParam, valgtDokumentInfoId]
    );

    return {
        hentDokument,
        valgtDokument,
        hentFørsteDokument,
        hentNesteDokument,
        hentForrigeDokument,
    };
};
