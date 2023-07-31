import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../App/typer/vedtak';
import { v4 as uuidv4 } from 'uuid';
import { tilÅrMåned } from '../../../../App/utils/dato';

export interface SkolepengerProps<T> {
    data: T[];
    oppdater: (data: T[]) => void;
    behandlingErRedigerbar: boolean;
    erOpphør?: boolean;
    erSkoleårOpphørt?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ValideringsPropsMedOppdatering<T extends Record<string, any>>
    extends SkolepengerProps<T> {
    valideringsfeil?: FormErrors<T>[];
    settValideringsFeil: (errors: FormErrors<T>[]) => void;
}

export const tomSkoleårsperiode: IPeriodeSkolepenger = {
    studietype: undefined,
    årMånedFra: '',
    årMånedTil: '',
    studiebelastning: undefined,
};

export const tomUtgift = (): SkolepengerUtgift => ({
    id: uuidv4(),
    årMånedFra: tilÅrMåned(new Date()),
    utgifter: undefined,
    stønad: undefined,
});

export const tomSkoleårsperiodeSkolepenger = (): ISkoleårsperiodeSkolepenger => ({
    perioder: [tomSkoleårsperiode],
    utgiftsperioder: [tomUtgift()],
    erHentetFraBackend: false,
});
