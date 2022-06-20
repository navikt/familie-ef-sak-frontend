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

export const findIndexForElementBefore = <T>(
    prevIndex: number,
    currentState: T[],
    previous: T[],
    findFn: (t: T, t2: T) => boolean
): number => {
    let i = prevIndex;
    for (; i >= 0; i--) {
        const previousItem = previous[i];
        const match = currentState.find((item) => findFn(item, previousItem));
        if (match) {
            break;
        }
    }
    return i;
};
