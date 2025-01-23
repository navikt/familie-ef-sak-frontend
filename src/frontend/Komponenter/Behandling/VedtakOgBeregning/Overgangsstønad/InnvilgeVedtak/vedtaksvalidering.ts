import {
    EAktivitet,
    EPeriodetype,
    IInntektsperiode,
    IVedtaksperiode,
} from '../../../../../App/typer/vedtak';
import {
    erEtter,
    erMånedÅrEtter,
    erMånedÅrEtterEllerLik,
    erMånedÅrLik,
    erPåfølgendeÅrMåned,
    plusMåneder,
    tilDato,
    tilÅrMåned,
} from '../../../../../App/utils/dato';
import { InnvilgeVedtakForm } from './InnvilgeOvergangsstønad';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import {
    fraPeriodeErEtterTilPeriode,
    ugyldigEtterfølgendePeriodeFeilmelding,
    validerGyldigTallverdi,
} from '../../Felles/utils';

const trettiMånederFremITiden = tilÅrMåned(plusMåneder(new Date(), 30));
const syvMånederFremITiden = tilÅrMåned(plusMåneder(new Date(), 7));

export const validerInnvilgetVedtakForm = ({
    perioder,
    inntekter,
    periodeBegrunnelse,
    inntektBegrunnelse,
    samordningsfradragType,
    yngsteBarnFødselsdatoMedAleneOmsorgOppfylt,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    const periodeBegrunnelseFeil =
        periodeBegrunnelse === '' || periodeBegrunnelse === undefined
            ? 'Mangelfull utfylling av periodebegrunnelse'
            : undefined;

    const inntektBegrunnelseFeil =
        inntektBegrunnelse === '' || inntektBegrunnelse === undefined
            ? 'Mangelfull utfylling av inntektsbegrunnelse'
            : undefined;

    const samordningsfradagEksisterer = inntekter.some((rad) => rad.samordningsfradrag);

    const typeSamordningFeil =
        samordningsfradagEksisterer && !samordningsfradragType
            ? 'Mangelfull utfylling av type samordningsfradag'
            : undefined;

    return {
        ...validerVedtaksperioder({
            perioder,
            inntekter,
            yngsteBarnFødselsdatoMedAleneOmsorgOppfylt,
        }),
        inntektBegrunnelse: inntektBegrunnelseFeil,
        periodeBegrunnelse: periodeBegrunnelseFeil,
        samordningsfradragType: typeSamordningFeil,
    };
};

const åtteÅrFremITiden = (barnDatoStreng: string) => plusMåneder(tilDato(barnDatoStreng), 96);

const yngsteBarnErOver8FørTilOgMedMåned = (
    yngsteBarnFødselsdatoMedAleneOmsorgOppfylt: string | undefined,
    årMånedTil: string | undefined
): boolean => {
    return (
        yngsteBarnFødselsdatoMedAleneOmsorgOppfylt !== undefined &&
        årMånedTil !== undefined &&
        erEtter(årMånedTil, åtteÅrFremITiden(yngsteBarnFødselsdatoMedAleneOmsorgOppfylt))
    );
};

const skalValidereOver8 = (
    periodeType: EPeriodetype | '' | undefined,
    aktivitet: EAktivitet | '' | undefined
) =>
    periodeType === EPeriodetype.HOVEDPERIODE ||
    periodeType === EPeriodetype.NY_PERIODE_FOR_NYTT_BARN ||
    (periodeType === EPeriodetype.UTVIDELSE &&
        aktivitet === EAktivitet.UTVIDELSE_FORSØRGER_I_UTDANNING);

export const validerVedtaksperioder = ({
    perioder,
    inntekter,
    yngsteBarnFødselsdatoMedAleneOmsorgOppfylt,
}: {
    perioder: IVedtaksperiode[];
    inntekter: IInntektsperiode[];
    yngsteBarnFødselsdatoMedAleneOmsorgOppfylt?: string | undefined;
}): FormErrors<{
    perioder: IVedtaksperiode[];
    inntekter: IInntektsperiode[];
}> => {
    let harPeriodeFør7mndFremITiden = false;

    const feilIVedtaksPerioder = perioder.map((vedtaksperiode, index) => {
        const { årMånedFra, årMånedTil, aktivitet, periodeType } = vedtaksperiode;

        let vedtaksperiodeFeil: FormErrors<IVedtaksperiode> = {
            aktivitet: undefined,
            periodeType: undefined,
            årMånedFra: undefined,
            årMånedTil: undefined,
        };
        const erSistePeriode = index === perioder.length - 1;

        if (
            skalValidereOver8(periodeType, aktivitet) &&
            yngsteBarnErOver8FørTilOgMedMåned(
                yngsteBarnFødselsdatoMedAleneOmsorgOppfylt,
                årMånedTil
            )
        ) {
            vedtaksperiodeFeil = {
                ...vedtaksperiodeFeil,
                periodeType: 'Barnet har fylt 8 år før til og med måned',
            };
        }

        if (periodeType === '' || periodeType === undefined) {
            vedtaksperiodeFeil = { ...vedtaksperiodeFeil, periodeType: 'Mangler periodetype' };
        }
        if (periodeType === EPeriodetype.MIDLERTIDIG_OPPHØR && erSistePeriode) {
            vedtaksperiodeFeil = {
                ...vedtaksperiodeFeil,
                periodeType: 'Siste periode kan ikke være opphør/ingen stønad',
            };
        }

        if (aktivitet === undefined || aktivitet === '') {
            vedtaksperiodeFeil = { ...vedtaksperiodeFeil, aktivitet: 'Mangler aktivitetstype' };
        }
        if (
            periodeType === EPeriodetype.PERIODE_FØR_FØDSEL &&
            aktivitet !== EAktivitet.IKKE_AKTIVITETSPLIKT
        ) {
            vedtaksperiodeFeil = { ...vedtaksperiodeFeil, aktivitet: 'Mangler aktivitetstype' };
        }

        if (!årMånedTil || !årMånedFra) {
            return {
                ...vedtaksperiodeFeil,
                årMånedFra: 'Mangelfull utfylling av vedtaksperiode',
            };
        }

        if (!erMånedÅrEtterEllerLik(årMånedFra, årMånedTil)) {
            return {
                ...vedtaksperiodeFeil,
                årMånedFra: fraPeriodeErEtterTilPeriode,
            };
        }

        const forrigePeriode = index > 0 && perioder[index - 1];

        if (forrigePeriode && forrigePeriode.årMånedTil) {
            if (!erMånedÅrEtter(forrigePeriode.årMånedTil, årMånedFra)) {
                return {
                    ...vedtaksperiodeFeil,
                    årMånedFra: ugyldigEtterfølgendePeriodeFeilmelding(),
                };
            }

            if (!erPåfølgendeÅrMåned(forrigePeriode.årMånedTil, årMånedFra)) {
                return {
                    ...vedtaksperiodeFeil,
                    årMånedFra: `Periodene er ikke sammenhengende`,
                };
            }
        }

        // Det er gyldig med periode etter 7mnd frem i tiden, hvis det finnes en periode før 7mnd frem i tiden
        if (!erMånedÅrEtter(syvMånederFremITiden, årMånedFra)) {
            harPeriodeFør7mndFremITiden = true;
        }
        if (erMånedÅrEtter(syvMånederFremITiden, årMånedFra) && !harPeriodeFør7mndFremITiden) {
            return {
                ...vedtaksperiodeFeil,
                årMånedFra: `Startdato (${årMånedFra}) mer enn 7mnd frem i tid`,
            };
        }
        if (erMånedÅrEtter(trettiMånederFremITiden, årMånedFra) && harPeriodeFør7mndFremITiden) {
            return {
                ...vedtaksperiodeFeil,
                årMånedFra: `Startdato (${årMånedFra}) mer enn 30mnd frem i tid`,
            };
        }
        return vedtaksperiodeFeil;
    });

    const inntektsperiodeFeil = inntekter.map((inntektsperiode, index) => {
        return {
            dagsats: validerGyldigTallverdi(inntektsperiode.dagsats),
            forventetInntekt: validerGyldigTallverdi(inntektsperiode.forventetInntekt),
            månedsinntekt: validerGyldigTallverdi(inntektsperiode.månedsinntekt),
            samordningsfradrag: validerGyldigTallverdi(inntektsperiode.samordningsfradrag),
            årMånedFra: validerInntektsperiode(inntektsperiode, perioder, index, inntekter),
        };
    });

    return {
        perioder: feilIVedtaksPerioder,
        inntekter: inntektsperiodeFeil,
    };
};

const validerInntektsperiode = (
    inntektsperiode: IInntektsperiode,
    perioder: IVedtaksperiode[],
    index: number,
    inntekter: IInntektsperiode[]
) => {
    const årMånedFra = inntektsperiode.årMånedFra;
    if (!årMånedFra) {
        return 'Mangelfull utfylling av inntektsperiode';
    }
    const førsteInnvilgedeVedtaksperiode =
        perioder.find(
            (vedtaksperiode) => vedtaksperiode.periodeType !== EPeriodetype.MIDLERTIDIG_OPPHØR
        ) || perioder[0];
    if (
        index === 0 &&
        førsteInnvilgedeVedtaksperiode &&
        førsteInnvilgedeVedtaksperiode.årMånedFra &&
        !erMånedÅrLik(årMånedFra, førsteInnvilgedeVedtaksperiode.årMånedFra)
    ) {
        return 'Første inntektsperiode må være lik vedtaksperiode';
    }
    const forrige = index > 0 && inntekter[index - 1];
    if (forrige && forrige.årMånedFra) {
        if (!erMånedÅrEtter(forrige.årMånedFra, årMånedFra)) {
            return ugyldigEtterfølgendePeriodeFeilmelding();
        }
    }
    if (erMånedÅrEtter(trettiMånederFremITiden, årMånedFra)) {
        return `Startdato (${årMånedFra}) mer enn 30mnd frem i tid`;
    }
    const sisteMånedIVedtaksperiode = perioder[perioder.length - 1]?.årMånedTil;
    if (sisteMånedIVedtaksperiode && erMånedÅrEtter(sisteMånedIVedtaksperiode, årMånedFra)) {
        return `Startdato (${årMånedFra}) er etter vedtaksperioden`;
    }

    return undefined;
};
