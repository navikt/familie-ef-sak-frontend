import {
    dokumentOversiktRequestKey,
    hentFraLocalStorage,
    lagreTilLocalStorage,
} from '../../../App/utils/localStorage';

export const hentBesøkteLenkerFraLocalStorage = (fagsakPersonId: string) =>
    hentFraLocalStorage<{ besøkteDokumentLenker: string[] }>(
        dokumentOversiktRequestKey(fagsakPersonId),
        { besøkteDokumentLenker: [] }
    ).besøkteDokumentLenker;

export const lagreBesøkteLenkerTilLocalStorage = (
    fagsakPersonId: string,
    dokumentLenker: string[]
) =>
    lagreTilLocalStorage<{ besøkteDokumentLenker: string[] }>(
        dokumentOversiktRequestKey(fagsakPersonId),
        {
            besøkteDokumentLenker: dokumentLenker,
        }
    );
