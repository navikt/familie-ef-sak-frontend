import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { erMånedÅrEtterEllerLik, tilSkoleår } from '../../../../../App/utils/dato';

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
    skoleårsperioder,
    begrunnelse,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        skoleårsperioder: validerSkoleårsperioderSkolepenger(skoleårsperioder),
        begrunnelse: !harVerdi(begrunnelse) ? 'Mangelfull utfylling av begrunnelse' : undefined,
    };
};

const validerSkoleårsperioderSkolepenger = (
    perioder: ISkoleårsperiodeSkolepenger[]
): FormErrors<ISkoleårsperiodeSkolepenger[]> => {
    return perioder.map((periode) => {
        const utgiftsperiodeFeil: FormErrors<ISkoleårsperiodeSkolepenger> = {
            perioder: validerDelperiodeSkoleår(periode.perioder),
            utgifter: validerUtgifter(periode.utgifter),
        };
        return utgiftsperiodeFeil;
    });
};

const validerDelperiodeSkoleår = (
    perioder: IPeriodeSkolepenger[]
): FormErrors<IPeriodeSkolepenger[]> => {
    let skoleår: number | undefined = undefined;
    return perioder.map((periode) => {
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
        const skoleårFra = tilSkoleår(årMånedFra);
        if (skoleårFra !== tilSkoleår(årMånedTil)) {
            return {
                ...periodeSkolepengerFeil,
                årMånedTil: `Fra og til er ikke i det samme skoleåret`,
            };
        }
        if (skoleår === undefined) {
            skoleår = skoleårFra;
        } else if (skoleår !== skoleårFra) {
            return {
                ...periodeSkolepengerFeil,
                årMånedFra: `Skoleåret er ikke det samme som tidligere skoleår`,
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
};

const validerUtgifter = (perioder: SkolepengerUtgift[]): FormErrors<SkolepengerUtgift[]> => {
    return perioder.map((periode) => {
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
        if (stønad > utgifter) {
            return {
                ...periodeUtgiftFeil,
                stønad: 'Stønad kan ikke være høyere enn utgifter',
            };
        }
        return periodeUtgiftFeil;
    });
};

const harVerdi = (begrunnelse?: string) => {
    return begrunnelse !== '' && begrunnelse !== undefined;
};
