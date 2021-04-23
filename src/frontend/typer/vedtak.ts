import { PeriodeVariant } from '../komponenter/Felleskomponenter/MånedÅr/MånedÅrPeriode';

export interface IVedtak {
    resultatType: EBehandlingResultat;
    periodeBegrunnelse: string;
    inntektBegrunnelse: string;
    perioder: IVedtaksperiode[];
    inntekter: IInntektsperiode[];
}

export interface IInntektsperiode {
    årMånedFra?: string;
    forventetInntekt?: number;
    samordningsfradrag?: number;
    endretKey?: string; // intern for re-rendring
}

export interface IBeløpsperiode {
    fraOgMedDato: string;
    tilDato: string;
    beregningsgrunnlag: IBeregningsgrunnlag;
    beløp: number;
}

export interface IBeregningsgrunnlag {
    inntekt: number;
    samordningsfradrag?: number;
    avkortningPerMåned: number;
    fullOvergangsStønadPerMåned: number;
    grunnbeløp: number;
}

export interface IVedtaksperiode {
    periodeType: EPeriodetype;
    aktivitet: EAktivitet;
    årMånedFra?: string;
    årMånedTil?: string;
}

export type IBeregningsrequest = {
    vedtaksperioder: IVedtaksperiode[];
    inntekt: IInntektsperiode[];
};

export interface IBeløpsperiode {
    fraOgMedDato: string;
    tilDato: string;
    beløp: number;
    beregningsgrunnlag: IBeregningsgrunnlag;
    beløpFørSamordning: number;
    inntektsreduksjon: number;
}

export interface IValideringsfeil {
    vedtaksperioder: string[];
    inntektsperioder: string[];
}

export enum EInntektsperiodeProperty {
    årMånedFra = 'årMånedFra',
    forventetInntekt = 'forventetInntekt',
    stønadsbeløp = 'stønadsbeløp',
    samordningsfradrag = 'samordningsfradrag',
    beløpFørSamordning = 'beløpFørSamordning',
}

export enum EBehandlingResultat {
    INNVILGE = 'INNVILGE',
    AVSLÅ = 'AVSLÅ',
    HENLEGGE = 'HENLEGGE',
    BEHANDLE_I_GOSYS = 'BEHANDLE_I_GOSYS',
}

export enum EPeriodetype {
    PERIODE_FØR_FØDSEL = 'PERIODE_FØR_FØDSEL',
    HOVEDPERIODE = 'HOVEDPERIODE',
}

export enum EPeriodeProperty {
    periodeType = 'periodeType',
    aktivitet = 'aktivitet',
    årMånedFra = 'årMånedFra',
    årMånedTil = 'årMånedTil',
}

export const periodeVariantTilProperty = (periodeVariant: PeriodeVariant): EPeriodeProperty => {
    switch (periodeVariant) {
        case PeriodeVariant.ÅR_MÅNED_FRA:
            return EPeriodeProperty.årMånedFra;
        case PeriodeVariant.ÅR_MÅNED_TIL:
            return EPeriodeProperty.årMånedTil;
    }
};

export enum EAktivitet {
    IKKE_AKTIVITETSPLIKT = 'IKKE_AKTIVITETSPLIKT',
    BARN_UNDER_ETT_ÅR = 'BARN_UNDER_ETT_ÅR',
    FORSØRGER_I_ARBEID = 'FORSØRGER_I_ARBEID',
    FORSØRGER_I_UTDANNING = 'FORSØRGER_I_UTDANNING',
    FORSØRGER_REELL_ARBEIDSSØKER = 'FORSØRGER_REELL_ARBEIDSSØKER',
    FORSØRGER_ETABLERER_VIRKSOMHET = 'FORSØRGER_ETABLERER_VIRKSOMHET',
    BARNET_SÆRLIG_TILSYNSKREVENDE = 'BARNET_SÆRLIG_TILSYNSKREVENDE',
    FORSØRGER_MANGLER_TILSYNSORDNING = 'FORSØRGER_MANGLER_TILSYNSORDNING',
    FORSØRGER_ER_SYK = 'FORSØRGER_ER_SYK',
    BARNET_ER_SYKT = 'BARNET_ER_SYKT',
}
