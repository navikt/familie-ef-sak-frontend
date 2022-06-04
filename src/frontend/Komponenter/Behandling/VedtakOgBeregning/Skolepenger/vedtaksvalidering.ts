import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../App/typer/vedtak';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { erMånedÅrEtterEllerLik } from '../../../../App/utils/dato';

const periodeSkolepengerFeil: FormErrors<IPeriodeSkolepenger> = {
    studietype: undefined,
    årMånedFra: undefined,
    årMånedTil: undefined,
    studiebelastning: undefined,
};

const periodeUtgiftFeil: FormErrors<SkolepengerUtgift> = {
    årMånedFra: undefined,
    utgifter: undefined,
    stønad: undefined,
};

export const validerInnvilgetVedtakForm = ({
    perioder,
    begrunnelse,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        ...validerPerioder({
            perioder,
        }),
        begrunnelse: !harVerdi(begrunnelse) ? 'Mangelfull utfylling av begrunnelse' : undefined,
    };
};

export const validerPerioder = ({
    perioder,
}: {
    perioder: ISkoleårsperiodeSkolepenger[];
}): FormErrors<{
    perioder: ISkoleårsperiodeSkolepenger[];
}> => {
    return {
        ...validerSkoleårsperioderSkolepenger({ perioder }),
    };
};

const validerSkoleårsperioderSkolepenger = ({
    perioder,
}: {
    perioder: ISkoleårsperiodeSkolepenger[];
}): FormErrors<{ perioder: ISkoleårsperiodeSkolepenger[] }> => {
    const feilIUtgiftsperioder = perioder.map((periode) => {
        const utgiftsperiodeFeil: FormErrors<ISkoleårsperiodeSkolepenger> = {
            perioder: validerDelperiodeSkoleår(periode.perioder),
            utgifter: validerUtgifter(periode.utgifter),
        };
        return utgiftsperiodeFeil;
    });

    return {
        perioder: feilIUtgiftsperioder,
    };
};

const validerDelperiodeSkoleår = (
    perioder: IPeriodeSkolepenger[]
): FormErrors<IPeriodeSkolepenger[]> => {
    const perioderFeil = perioder.map((periode) => {
        const { studietype, årMånedFra, årMånedTil, studiebelastning } = periode;
        if (!studietype) {
            return { ...periodeSkolepengerFeil, studietype: 'Mangelfull utfylling av studietype' };
        }
        if (!årMånedFra || !årMånedTil) {
            return {
                ...periodeSkolepengerFeil,
                årMånedFra: 'Mangelfull utfylling av utgiftsperiode',
            };
        }
        if (!erMånedÅrEtterEllerLik(årMånedFra, årMånedTil)) {
            return {
                ...periodeSkolepengerFeil,
                årMånedFra: `Ugyldig periode - fra (${årMånedFra}) må være før til (${årMånedTil})`,
            };
        }
        if (!studiebelastning) {
            return {
                ...periodeSkolepengerFeil,
                studiebelastning: 'Mangelfull utfylling av studiebelastning',
            };
        }
        if (studiebelastning < 1 || studiebelastning > 100) {
            return {
                ...periodeSkolepengerFeil,
                studiebelastning: 'Studiebelastning må være mellom 1-100%',
            };
        }
        return periodeSkolepengerFeil;
    });
    return perioderFeil;
};

const validerUtgifter = (perioder: SkolepengerUtgift[]): FormErrors<SkolepengerUtgift[]> => {
    const perioderFeil = perioder.map((periode) => {
        const { årMånedFra, utgifter, stønad } = periode;

        if (!årMånedFra) {
            return {
                ...periodeUtgiftFeil,
                årMånedFra: 'Mangelfull utfylling av fradato',
            };
        }

        if (!utgifter || utgifter < 1) {
            return {
                ...periodeUtgiftFeil,
                utgifter: 'Mangelfull utfylling av utgifter',
            };
        }

        if (stønad === undefined || stønad === null) {
            return {
                ...periodeUtgiftFeil,
                stønad: 'Mangelfull utfylling av stønad',
            };
        }
        return periodeUtgiftFeil;
    });
    return perioderFeil;
};

const harVerdi = (begrunnelse?: string) => {
    return begrunnelse !== '' && begrunnelse !== undefined;
};
