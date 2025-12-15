import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import { v4 as uuidv4 } from 'uuid';
import { tilÅrMåned } from '../../../../../App/utils/dato';

export type InnvilgeVedtakForm = {
    skoleårsperioder: ISkoleårsperiodeSkolepenger[];
    begrunnelse?: string;
};

export interface SkolepengerProps<T> {
    data: T[];
    oppdater: (data: T[]) => void;
    behandlingErRedigerbar: boolean;
    erOpphør?: boolean;
    erSkoleårOpphørt?: boolean;
}

// prettier-ignore
// eslint-disable-next-line
export interface ValideringsPropsMedOppdatering<T extends Record<string, any>> extends SkolepengerProps<T> {
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
    stønad: undefined,
});

export const tomSkoleårsperiodeSkolepenger = (): ISkoleårsperiodeSkolepenger => ({
    perioder: [tomSkoleårsperiode],
    utgiftsperioder: [tomUtgift()],
    erHentetFraBackend: false,
});
