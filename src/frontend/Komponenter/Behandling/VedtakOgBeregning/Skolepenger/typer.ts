import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../App/typer/vedtak';

export interface ValideringsPropsMedOppdatering<T> {
    data: T[];
    oppdater: (data: T[]) => void;
    behandlingErRedigerbar: boolean;
    valideringsfeil?: FormErrors<T>[];
    settValideringsFeil: (errors: FormErrors<T>[]) => void;
}

export const tomSkoleårsperiode: IPeriodeSkolepenger = {
    studietype: undefined,
    årMånedFra: '',
    årMånedTil: '',
    studiebelastning: undefined,
};

export const tomUtgift: SkolepengerUtgift = {
    årMånedFra: '',
    utgifter: undefined,
    stønad: undefined,
};

export const tomSkoleårsperiodeSkolepenger: ISkoleårsperiodeSkolepenger = {
    perioder: [tomSkoleårsperiode],
    utgiftsperioder: [tomUtgift],
};
