import {
    dokumentOversiktKeyPrefix,
    dokumentOversiktRequestKey,
    hentFraLocalStorage,
    lagreTilLocalStorage,
    slettElementFraLocalStorage,
} from '../../../App/utils/localStorage';

interface BesøkteDokumenter {
    besøkteDokumentLenker: string[];
    endretTidspunkt: string;
}

const fallbackVerdi: BesøkteDokumenter = {
    besøkteDokumentLenker: [],
    endretTidspunkt: new Date().toISOString(),
};

export const hentBesøkteLenkerFraLocalStorage = (fagsakPersonId: string) =>
    hentFraLocalStorage<BesøkteDokumenter>(
        dokumentOversiktRequestKey(fagsakPersonId),
        fallbackVerdi
    ).besøkteDokumentLenker;

export const lagreBesøkteLenkerTilLocalStorage = (
    fagsakPersonId: string,
    dokumentLenker: string[]
) =>
    lagreTilLocalStorage<BesøkteDokumenter>(dokumentOversiktRequestKey(fagsakPersonId), {
        besøkteDokumentLenker: dokumentLenker,
        endretTidspunkt: new Date().toISOString(),
    });

export const slettForeldedeInnslagFraLocalStorage = () => {
    const nåværendeTidspunkt = Date.now();
    const utløpstidspunktFjortenDager = 14 * 24 * 60 * 60 * 1000;

    for (const key of Object.keys(localStorage)) {
        if (key.startsWith(dokumentOversiktKeyPrefix)) {
            const besøkteDokumenter = hentFraLocalStorage<BesøkteDokumenter>(key, fallbackVerdi);
            const endretTidspunkt = new Date(besøkteDokumenter.endretTidspunkt).getTime();

            if (nåværendeTidspunkt - endretTidspunkt > utløpstidspunktFjortenDager) {
                slettElementFraLocalStorage(key);
            }
        }
    }
};
