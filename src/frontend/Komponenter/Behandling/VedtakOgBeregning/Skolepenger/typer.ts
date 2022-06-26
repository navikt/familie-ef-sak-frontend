import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../App/typer/vedtak';
import { v4 as uuidv4 } from 'uuid';

export interface SkolepengerProps<T> {
    data: T[];
    oppdater: (data: T[]) => void;
    behandlingErRedigerbar: boolean;
    erOpphør?: boolean;
    skoleårErFjernet?: boolean;
}

export interface ValideringsPropsMedOppdatering<T> extends SkolepengerProps<T> {
    valideringsfeil?: FormErrors<T>[];
    settValideringsFeil: (errors: FormErrors<T>[]) => void;
}

export interface SkolepengerOpphørProps<T> extends SkolepengerProps<T> {
    forrigeData: T[];
}

export const tomSkoleårsperiode: IPeriodeSkolepenger = {
    studietype: undefined,
    årMånedFra: '',
    årMånedTil: '',
    studiebelastning: undefined,
};

export const tomUtgift = (): SkolepengerUtgift => ({
    id: uuidv4(),
    årMånedFra: '',
    utgifter: undefined,
    stønad: undefined,
});

export const tomSkoleårsperiodeSkolepenger = (): ISkoleårsperiodeSkolepenger => ({
    perioder: [tomSkoleårsperiode],
    utgiftsperioder: [tomUtgift()],
});
