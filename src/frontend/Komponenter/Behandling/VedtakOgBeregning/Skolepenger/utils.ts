import {
    EUtgiftstype,
    ISkoleårsperiodeSkolepenger,
    utgiftstypeTilTekst,
} from '../../../../App/typer/vedtak';
import { ISelectOption } from '@navikt/familie-form-elements';

export const utgiftstyperFormatert = (utgiftstyper: EUtgiftstype[]) =>
    utgiftstyper.map<ISelectOption>((typeEnum) => {
        return {
            value: typeEnum,
            label: utgiftstypeTilTekst[typeEnum],
        };
    });

export const sjekkHarValgtAlleUtgiftstyper = (skoleårsperioder: ISkoleårsperiodeSkolepenger[]) =>
    skoleårsperioder.some((skoleårsperiode) =>
        skoleårsperiode.utgiftsperioder.some(
            (utgiftsperiode) => utgiftsperiode.utgiftstyper.length === 3
        )
    );

/**
 * Brukes når man har slettet element i [currentItems] og ønsker å ta en restore for det elementet og plassere det på riktig plass i [currentItems]
 *  eks hvis man har previousItems=[1,2,3,4] og har slettet 2 og 3, sånn att currentItems=[1,4]
 *  så skal man legge tilbake 3, då skal den settes inn på plass 1 => [1,3,4]
 *  Hvis man då ønsker å legge tilbake 2 så skal den inn på plass 1 => [1,2,3,4]
 *
 * @param indexPreviousItemsToRestore index for element i [previousItems] som man ønsker
 * @param equalFn fn for å matche 2 items mellom current og previous
 */
export const locateIndexToRestorePreviousItemInCurrentItems = <T>(
    indexPreviousItemsToRestore: number,
    currentItems: T[],
    previousItems: T[],
    equalFn: (t: T, t2: T) => boolean
): number => {
    let i = indexPreviousItemsToRestore;
    for (; i >= 0; i--) {
        const previousItem = previousItems[i];
        const match = currentItems.find((item) => equalFn(item, previousItem));
        if (match) {
            break;
        }
    }
    return i;
};
