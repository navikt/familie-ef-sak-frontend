import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import { InnvilgeVedtakForm } from '../Felles/typer';
import {
    erMånedÅrEtterEllerLik,
    Intervall,
    månedÅrTilDate,
    overlapper,
} from '../../../../../App/utils/dato';
import { beregnSkoleår } from '../Felles/skoleår';

const periodeSkolepengerFeil: FormErrors<IPeriodeSkolepenger> = {
    studietype: undefined,
    årMånedFra: undefined,
    årMånedTil: undefined,
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
        skoleårsperioder: validerSkoleårsperioderSkolepenger(skoleårsperioder, true),
        begrunnelse: !harVerdi(begrunnelse) ? 'Mangelfull utfylling av begrunnelse' : undefined,
    };
};

export const validerInnvilgetVedtakFormUtenUtgifter = ({
    skoleårsperioder,
    begrunnelse,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        skoleårsperioder: validerSkoleårsperioderSkolepenger(skoleårsperioder, false),
        begrunnelse: !harVerdi(begrunnelse) ? 'Mangelfull utfylling av begrunnelse' : undefined,
    };
};

export const validerSkoleårsperioder = ({
    skoleårsperioder,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        skoleårsperioder: validerSkoleårsperioderSkolepenger(skoleårsperioder, true),
        begrunnelse: undefined,
    };
};

export const validerSkoleårsperioderUtenUtgifter = ({
    skoleårsperioder,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        skoleårsperioder: validerSkoleårsperioderSkolepenger(skoleårsperioder, false),
        begrunnelse: undefined,
    };
};

const validerSkoleårsperioderSkolepenger = (
    perioder: ISkoleårsperiodeSkolepenger[],
    skalValidereMangelfullUtfyllingAvUtgifter: boolean | undefined
): FormErrors<ISkoleårsperiodeSkolepenger[]> => {
    return perioder.map((periode) => {
        const utgiftsperiodeFeil: FormErrors<ISkoleårsperiodeSkolepenger> = {
            perioder: validerDelperiodeSkoleår(periode.perioder),
            utgiftsperioder: validerUtgifter(
                periode.utgiftsperioder,
                skalValidereMangelfullUtfyllingAvUtgifter
            ),
            erHentetFraBackend: undefined,
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
        const intervall: Intervall = {
            fra: månedÅrTilDate(årMånedFra),
            til: månedÅrTilDate(årMånedTil),
        };
        if (tidligerePerioder.some((periode) => overlapper(periode, intervall))) {
            return {
                ...periodeSkolepengerFeil,
                årMånedFra: `Ugyldig periode - overlapper med tidligere periode`,
            };
        }
        tidligerePerioder.push(intervall);
        const skoleårForPeriode = beregnSkoleår(årMånedFra, årMånedTil);
        if (!skoleårForPeriode.gyldig) {
            return {
                ...periodeSkolepengerFeil,
                årMånedFra: skoleårForPeriode.årsak,
            };
        } else {
            if (skoleår === undefined) {
                skoleår = skoleårForPeriode.skoleår;
            } else if (skoleår !== skoleårForPeriode.skoleår) {
                return {
                    ...periodeSkolepengerFeil,
                    årMånedFra: `Skoleåret er ikke det samme som tidligere skoleår`,
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

const validerUtgifter = (
    perioder: SkolepengerUtgift[],
    skalValidereMangelfullUtfyllingAvUtgifter: boolean | undefined
): FormErrors<SkolepengerUtgift[]> => {
    return perioder.map((periode) => {
        const { årMånedFra, utgifter, stønad } = periode;

        if (!årMånedFra) {
            return {
                ...periodeUtgiftFeil,
                årMånedFra: 'Mangelfull utfylling av fradato',
            };
        }

        if (stønad === undefined || stønad === null) {
            return {
                ...periodeUtgiftFeil,
                stønad: 'Mangelfull utfylling av stønad',
            };
        }

        if (skalValidereMangelfullUtfyllingAvUtgifter) {
            if (!utgifter || utgifter < 1) {
                return {
                    ...periodeUtgiftFeil,
                    utgifter: 'Mangelfull utfylling av utgifter',
                };
            }

            if (stønad > utgifter) {
                return {
                    ...periodeUtgiftFeil,
                    stønad: 'Stønad kan ikke være høyere enn utgifter',
                };
            }
        }

        return periodeUtgiftFeil;
    });
};

const harVerdi = (begrunnelse?: string) => {
    return begrunnelse !== '' && begrunnelse !== undefined;
};
