import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { OrNothing } from './felles/useSorteringState';
import { IJournalpost } from '../typer/journalforing';

interface HentDokumentResponse {
    hentDokument: (dokumentinfoId: string) => void;
    valgtDokument: Ressurs<string>;
    hentFørsteDokument: (journalpost: IJournalpost) => void;
    hentNesteDokument: (journalpost: IJournalpost) => void;
    hentForrigeDokument: (journalpost: IJournalpost) => void;
}
export const useHentDokument = (journalpostIdParam: OrNothing<string>): HentDokumentResponse => {
    const { axiosRequest } = useApp();
    const [valgtDokument, settValgtDokument] = useState<Ressurs<string>>(byggTomRessurs());
    const [valgtDokumentInfoId, settDokumentInfoId] = useState<string | undefined>();
    const hentDokument = useCallback(
        (dokumentInfoId: string) => {
            settDokumentInfoId(dokumentInfoId);
            settValgtDokument(byggHenterRessurs());
            axiosRequest<string, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/journalpost/${journalpostIdParam}/dokument/${dokumentInfoId}`,
            }).then((res: Ressurs<string>) => settValgtDokument(res));
        },
        // eslint-disable-next-line
        [journalpostIdParam]
    );

    const hentFørsteDokument = useCallback(
        (journalpost: IJournalpost) => {
            hentDokumentForIndex(journalpost, 0);
        },
        // eslint-disable-next-line
        [journalpostIdParam]
    );

    const hentDokumentForIndex = useCallback(
        (journalpost: IJournalpost, index: number) => {
            if (journalpost.dokumenter && journalpost.dokumenter.length > index) {
                hentDokument(journalpost.dokumenter[index].dokumentInfoId);
            }
        },
        // eslint-disable-next-line
        [journalpostIdParam]
    );

    const indeksForValgtDokument = useCallback(
        (journalpost: IJournalpost) => {
            return journalpost.dokumenter.findIndex(
                (dok) => dok.dokumentInfoId === valgtDokumentInfoId
            );
        },
        // eslint-disable-next-line
        [valgtDokumentInfoId]
    );

    const hentNesteDokument = useCallback(
        (journalpost: IJournalpost) => {
            const nesteEllerFørsteIndeks =
                (indeksForValgtDokument(journalpost) + 1) % journalpost.dokumenter.length;
            hentDokumentForIndex(journalpost, nesteEllerFørsteIndeks);
        },
        // eslint-disable-next-line
        [journalpostIdParam, valgtDokumentInfoId]
    );

    const hentForrigeDokument = useCallback(
        (journalpost: IJournalpost) => {
            const forrigeEllerSisteIndeks =
                (indeksForValgtDokument(journalpost) - 1 + journalpost.dokumenter.length) %
                journalpost.dokumenter.length;
            hentDokumentForIndex(journalpost, forrigeEllerSisteIndeks);
        },
        // eslint-disable-next-line
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
