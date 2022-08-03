import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import {
    erFomMånedEtterEllerLikTomMåned,
    erMangelfullPeriode,
    erMånedÅrEtterEllerLik,
    Intervall,
    månedÅrTilDate,
    overlapper,
} from '../../../../../App/utils/dato';
import { beregnSkoleår } from '../skoleår';

const periodeSkolepengerFeil: FormErrors<IPeriodeSkolepenger> = {
    studietype: undefined,
    periode: {fomMåned: undefined, tomMåned: undefined},
    studiebelastning: undefined,
};

const periodeUtgiftFeil: FormErrors<SkolepengerUtgift> = {
    id: undefined,
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

export const validerInnvilgetVedtakFormBeregning = ({
    skoleårsperioder,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        skoleårsperioder: validerSkoleårsperioderSkolepenger(skoleårsperioder),
        begrunnelse: undefined,
    };
};

const validerSkoleårsperioderSkolepenger = (
    perioder: ISkoleårsperiodeSkolepenger[]
): FormErrors<ISkoleårsperiodeSkolepenger[]> => {
    return perioder.map((periode) => {
        const utgiftsperiodeFeil: FormErrors<ISkoleårsperiodeSkolepenger> = {
            perioder: validerDelperiodeSkoleår(periode.perioder),
            utgiftsperioder: validerUtgifter(periode.utgiftsperioder),
        };
        return utgiftsperiodeFeil;
    });
};

const validerDelperiodeSkoleår = (
    perioder: IPeriodeSkolepenger[]
): FormErrors<IPeriodeSkolepenger[]> => {
    let skoleår: number | undefined = undefined;
    const tidligerePerioder: Intervall[] = [];
    return perioder.map((periode) => {
        const { studietype, periode, studiebelastning } = periode;
        if (!studietype) {
            return { ...periodeSkolepengerFeil, studietype: 'Mangelfull utfylling av studietype' };
        }
        if (erMangelfullPeriode(periode)) {
            return {
                ...periodeSkolepengerFeil,
                fomMåned: 'Mangelfull utfylling av utgiftsperiode',
            };
        }
        if (!erFomMånedEtterEllerLikTomMåned(periode)) {
            return {
                ...periodeSkolepengerFeil,
                fomMåned: `Ugyldig periode - fra (${periode.fomMåned}) må være før til (${periode.tomMåned})`,
            };
        }
        const intervall: Intervall = {
            fra: månedÅrTilDate(periode.fomMåned),
            til: månedÅrTilDate(periode.tomMåned),
        };
        if (tidligerePerioder.some((periode) => overlapper(periode, intervall))) {
            return {
                ...periodeSkolepengerFeil,
                fomMåned: `Ugyldig periode - overlapper med tidligere periode`,
            };
        }
        tidligerePerioder.push(intervall);
        const skoleårForPeriode = beregnSkoleår(periode.fomMåned, periode.tomMåned);
        if (!skoleårForPeriode.gyldig) {
            return {
                ...periodeSkolepengerFeil,
                fomMåned: skoleårForPeriode.årsak,
            };
        } else {
            if (skoleår === undefined) {
                skoleår = skoleårForPeriode.skoleår;
            } else if (skoleår !== skoleårForPeriode.skoleår) {
                return {
                    ...periodeSkolepengerFeil,
                    fomMåned: `Skoleåret er ikke det samme som tidligere skoleår`,
                };
            }
        }
        if (!studiebelastning) {
            return {
                ...periodeSkolepengerFeil,
                studiebelastning: 'Mangelfull utfylling av studiebelastning',
            };
        }
        if (studiebelastning < 50 || studiebelastning > 100) {
            return {
                ...periodeSkolepengerFeil,
                studiebelastning: 'Studiebelastning må være mellom 50-100%',
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
