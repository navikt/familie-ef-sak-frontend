import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import {
    erMånedÅrEtterEllerLik,
    Intervall,
    månedÅrTilDate,
    overlapper,
} from '../../../../../App/utils/dato';
import { beregnSkoleår, validerSkoleår } from './skoleår';
import { validerGyldigTallverdi } from '../../Felles/utils';
import { InnvilgeVedtakForm } from './typer';

const periodeSkolepengerFeil: FormErrors<IPeriodeSkolepenger> = {
    studietype: undefined,
    årMånedFra: undefined,
    årMånedTil: undefined,
    studiebelastning: undefined,
};

const periodeUtgiftFeil: FormErrors<SkolepengerUtgift> = {
    id: undefined,
    årMånedFra: undefined,
    stønad: undefined,
};

export const validerSkoleårsperioderForOpphør = ({ begrunnelse }: InnvilgeVedtakForm) => {
    return {
        skoleårsperioder: [],
        begrunnelse: !harVerdi(begrunnelse) ? 'Mangelfull utfylling av begrunnelse' : undefined,
    };
};

export const validerSkoleårsperioderMedBegrunnelse = ({
    skoleårsperioder,
    begrunnelse,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    const validerteSkoleår = validerSkoleår(skoleårsperioder);

    //TODO: Sett denne feilmeldingen på det skoleåret som er årsaken til duplikatfeil, hvis ønskelig
    if (!validerteSkoleår.gyldig) {
        return { skoleårsperioder: [], begrunnelse: validerteSkoleår.årsak };
    }

    return {
        skoleårsperioder: validerSkoleårsperioder(skoleårsperioder),
        begrunnelse: !harVerdi(begrunnelse) ? 'Mangelfull utfylling av begrunnelse' : undefined,
    };
};

export const validerSkoleårsperioderUtenBegrunnelse = ({
    skoleårsperioder,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    const validerteSkoleår = validerSkoleår(skoleårsperioder);

    //TODO: Sett denne feilmeldingen på det skoleåret som er årsaken til duplikatfeil, hvis ønskelig
    if (!validerteSkoleår.gyldig) {
        return { skoleårsperioder: [], begrunnelse: validerteSkoleår.årsak };
    }

    return {
        skoleårsperioder: validerSkoleårsperioder(skoleårsperioder),
        begrunnelse: undefined,
    };
};

export const validerSkoleårsperioderUtenBegrunnelseOgUtgiftsperioder = ({
    skoleårsperioder,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    const validerteSkoleår = validerSkoleår(skoleårsperioder);

    //TODO: Sett denne feilmeldingen på det skoleåret som er årsaken til duplikatfeil, hvis ønskelig
    if (!validerteSkoleår.gyldig) {
        return { skoleårsperioder: [], begrunnelse: validerteSkoleår.årsak };
    }

    return {
        skoleårsperioder: validerSkoleårsperioderUtenUtgiftsperioder(skoleårsperioder),
        begrunnelse: undefined,
    };
};

const validerSkoleårsperioder = (
    perioder: ISkoleårsperiodeSkolepenger[]
): FormErrors<ISkoleårsperiodeSkolepenger[]> => {
    return perioder.map((periode) => {
        const skoleårsperiodeFeil: FormErrors<ISkoleårsperiodeSkolepenger> = {
            perioder: validerDelårsperioder(periode.perioder),
            utgiftsperioder: validerUtgifsperioder(periode.utgiftsperioder),
            erHentetFraBackend: undefined,
        };
        return skoleårsperiodeFeil;
    });
};

export const validerSkoleårsperioderUtenUtgiftsperioder = (
    perioder: ISkoleårsperiodeSkolepenger[]
): FormErrors<ISkoleårsperiodeSkolepenger[]> => {
    return perioder.map((periode) => {
        const utgiftsperiodeFeil: FormErrors<ISkoleårsperiodeSkolepenger> = {
            perioder: validerDelårsperioder(periode.perioder),
            utgiftsperioder: [],
            erHentetFraBackend: undefined,
        };
        return utgiftsperiodeFeil;
    });
};

const validerDelårsperioder = (
    perioder: IPeriodeSkolepenger[]
): FormErrors<IPeriodeSkolepenger[]> => {
    let skoleår: number | undefined = undefined;
    const tidligerePerioder: Intervall[] = [];
    return perioder.map((periode) => {
        const { studietype, årMånedFra, årMånedTil, studiebelastning } = periode;
        if (!studietype) {
            return { ...periodeSkolepengerFeil, studietype: 'Mangelfull utfylling av studietype' };
        }
        if (!studiebelastning) {
            return {
                ...periodeSkolepengerFeil,
                studiebelastning: 'Mangelfull utfylling av studiebelastning',
            };
        }
        if (!årMånedFra || !årMånedTil) {
            return {
                ...periodeSkolepengerFeil,
                årMånedFra: 'Mangelfull utfylling av gjeldende periode',
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
        if (studiebelastning < 50 || studiebelastning > 100) {
            return {
                ...periodeSkolepengerFeil,
                studiebelastning: 'Studiebelastning må være mellom 50-100%',
            };
        }
        return periodeSkolepengerFeil;
    });
};

const validerUtgifsperioder = (perioder: SkolepengerUtgift[]): FormErrors<SkolepengerUtgift[]> => {
    return perioder.map((periode) => {
        const { årMånedFra, stønad } = periode;

        if (!årMånedFra) {
            return {
                ...periodeUtgiftFeil,
                årMånedFra: 'Mangelfull utfylling av fradato',
            };
        }

        if (stønad === undefined || stønad === null) {
            return {
                ...periodeUtgiftFeil,
                stønad: 'Mangelfull utfylling av beløp',
            };
        }
        return {
            ...periodeUtgiftFeil,
            stønad: validerGyldigTallverdi(stønad),
        };
    });
};

const harVerdi = (begrunnelse?: string) => {
    return begrunnelse !== '' && begrunnelse !== undefined;
};
