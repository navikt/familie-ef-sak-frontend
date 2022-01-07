import { PeriodeVariant } from '../../Felles/Input/MånedÅr/MånedÅrPeriode';

export type IAvslåVedtak = {
    resultatType: EBehandlingResultat.AVSLÅ;
    avslåÅrsak: EAvslagÅrsak;
    avslåBegrunnelse: string;
};
export interface IBeløpsperiode {
    periode: { fradato: string; tildato: string };
    beregningsgrunnlag: IBeregningsgrunnlag;
    beløp: number;
    beløpFørSamordning: number;
}

export interface IBeregningsgrunnlag {
    inntekt: number;
    samordningsfradrag: number;
    avkortningPerMåned: number;
    fullOvergangsStønadPerMåned: number | null;
    grunnbeløp: number | null;
}
export type IInnvilgeVedtak = {
    resultatType: EBehandlingResultat.INNVILGE;
    periodeBegrunnelse?: string;
    inntektBegrunnelse?: string;
    perioder: IVedtaksperiode[];
    inntekter: IInntektsperiode[];
};

export interface IOpphørtVedtak {
    resultatType: EBehandlingResultat.OPPHØRT;
    opphørFom: string;
    begrunnelse: string;
}

export type IVedtak = IAvslåVedtak | IInnvilgeVedtak | IOpphørtVedtak;

export interface IInntektsperiode {
    årMånedFra?: string;
    forventetInntekt?: number;
    samordningsfradrag?: number;
    endretKey?: string; // intern for re-rendring
}

export interface IVedtaksperiode {
    periodeType: EPeriodetype | '' | undefined;
    aktivitet: EAktivitet | '' | undefined;
    årMånedFra?: string;
    årMånedTil?: string;
}

export type IBeregningsrequest = {
    vedtaksperioder: IVedtaksperiode[];
    inntekt: IInntektsperiode[];
};

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
    OPPHØRT = 'OPPHØRT',
}

export enum EPeriodetype {
    FORLENGELSE = 'FORLENGELSE',
    HOVEDPERIODE = 'HOVEDPERIODE',
    PERIODE_FØR_FØDSEL = 'PERIODE_FØR_FØDSEL',
    UTVIDELSE = 'UTVIDELSE',
    MIDLERTIDIG_OPPHØR = 'MIDLERTIDIG_OPPHØR',
}

export enum EPeriodeProperty {
    periodeType = 'periodeType',
    aktivitet = 'aktivitet',
    årMånedFra = 'årMånedFra',
    årMånedTil = 'årMånedTil',
}

export enum EAvslagÅrsak {
    VILKÅR_IKKE_OPPFYLT = 'VILKÅR_IKKE_OPPFYLT',
    BARN_OVER_ÅTTE_ÅR = 'BARN_OVER_ÅTTE_ÅR',
    STØNADSTID_OPPBRUKT = 'STØNADSTID_OPPBRUKT',
    MANGLENDE_OPPLYSNINGER = 'MANGLENDE_OPPLYSNINGER',
}

export const årsakerTilAvslag: EAvslagÅrsak[] = [
    EAvslagÅrsak.BARN_OVER_ÅTTE_ÅR,
    EAvslagÅrsak.MANGLENDE_OPPLYSNINGER,
    EAvslagÅrsak.STØNADSTID_OPPBRUKT,
];

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
    UTVIDELSE_FORSØRGER_I_UTDANNING = 'UTVIDELSE_FORSØRGER_I_UTDANNING',
    UTVIDELSE_BARNET_SÆRLIG_TILSYNSKREVENDE = 'UTVIDELSE_BARNET_SÆRLIG_TILSYNSKREVENDE',
    FORLENGELSE_MIDLERTIDIG_SYKDOM = 'FORLENGELSE_STØNAD_UT_SKOLEÅRET',
    FORLENGELSE_STØNAD_PÅVENTE_ARBEID = 'FORLENGELSE_STØNAD_PÅVENTE_ARBEID',
    FORLENGELSE_STØNAD_PÅVENTE_ARBEID_REELL_ARBEIDSSØKER = 'FORLENGELSE_STØNAD_PÅVENTE_ARBEID_REELL_ARBEIDSSØKER',
    FORLENGELSE_STØNAD_PÅVENTE_OPPSTART_KVALIFISERINGSPROGRAM = 'FORLENGELSE_STØNAD_PÅVENTE_OPPSTART_KVALIFISERINGSPROGRAM',
    FORLENGELSE_STØNAD_PÅVENTE_TILSYNSORDNING = 'FORLENGELSE_STØNAD_PÅVENTE_TILSYNSORDNING',
    FORLENGELSE_STØNAD_PÅVENTE_UTDANNING = 'FORLENGELSE_STØNAD_PÅVENTE_UTDANNING',
    FORLENGELSE_STØNAD_UT_SKOLEÅRET = 'FORLENGELSE_MIDLERTIDIG_SYKDOM',
}

export const aktiviteterForlengelse: EAktivitet[] = [
    EAktivitet.FORLENGELSE_MIDLERTIDIG_SYKDOM,
    EAktivitet.FORLENGELSE_STØNAD_PÅVENTE_ARBEID,
    EAktivitet.FORLENGELSE_STØNAD_PÅVENTE_ARBEID_REELL_ARBEIDSSØKER,
    EAktivitet.FORLENGELSE_STØNAD_PÅVENTE_OPPSTART_KVALIFISERINGSPROGRAM,
    EAktivitet.FORLENGELSE_STØNAD_PÅVENTE_TILSYNSORDNING,
    EAktivitet.FORLENGELSE_STØNAD_PÅVENTE_UTDANNING,
    EAktivitet.FORLENGELSE_STØNAD_UT_SKOLEÅRET,
];

export const aktiviteterHovedIngenPlikt: EAktivitet[] = [EAktivitet.BARN_UNDER_ETT_ÅR];

export const aktiviteterHovedFyllerPlikt: EAktivitet[] = [
    EAktivitet.FORSØRGER_I_ARBEID,
    EAktivitet.FORSØRGER_I_UTDANNING,
    EAktivitet.FORSØRGER_REELL_ARBEIDSSØKER,
    EAktivitet.FORSØRGER_ETABLERER_VIRKSOMHET,
];

export const aktiviteterHovedFyllerUnntak: EAktivitet[] = [
    EAktivitet.BARNET_SÆRLIG_TILSYNSKREVENDE,
    EAktivitet.FORSØRGER_MANGLER_TILSYNSORDNING,
    EAktivitet.FORSØRGER_ER_SYK,
    EAktivitet.BARNET_ER_SYKT,
];

export const aktiviteterUtvidelse: EAktivitet[] = [
    EAktivitet.UTVIDELSE_FORSØRGER_I_UTDANNING,
    EAktivitet.UTVIDELSE_BARNET_SÆRLIG_TILSYNSKREVENDE,
];

export const periodetypeTilTekst: Record<EPeriodetype | '', string> = {
    PERIODE_FØR_FØDSEL: 'Periode før fødsel',
    HOVEDPERIODE: 'Hovedperiode',
    UTVIDELSE: 'Utvidelse',
    FORLENGELSE: 'Forlengelse',
    MIDLERTIDIG_OPPHØR: 'Opphør/Ingen stønad',
    '': '',
};

export const behandlingResultatTilTekst: Record<EBehandlingResultat, string> = {
    INNVILGE: 'Innvilge',
    AVSLÅ: 'Avslå',
    HENLEGGE: 'Henlegge',
    BEHANDLE_I_GOSYS: 'Behandle i Gosys',
    OPPHØRT: 'Opphørt',
};

export const aktivitetTilTekst: Record<EAktivitet, string> = {
    IKKE_AKTIVITETSPLIKT: '',
    BARN_UNDER_ETT_ÅR: 'Barn er under 1 år',
    FORSØRGER_I_ARBEID: 'Forsørger er i arbeid (§15-6 første ledd)',
    FORSØRGER_I_UTDANNING: 'Forsørger er i utdanning (§15-6 første ledd)',
    FORSØRGER_REELL_ARBEIDSSØKER: 'Forsørger er reell arbeidssøker (§15-6 første ledd)',
    FORSØRGER_ETABLERER_VIRKSOMHET: 'Forsørger etablerer egen virksomhet (§15-6 første ledd)',
    BARNET_SÆRLIG_TILSYNSKREVENDE: 'Barnet er særlig tilsynskrevende (§15-6 fjerde ledd)',
    FORSØRGER_MANGLER_TILSYNSORDNING: 'Forsørger mangler tilsynsordning (§15-6 femte ledd)',
    FORSØRGER_ER_SYK: 'Forsørger er syk (§15-6 femte ledd)',
    BARNET_ER_SYKT: 'Barnet er sykt (§15-6 femte ledd)',
    UTVIDELSE_BARNET_SÆRLIG_TILSYNSKREVENDE: 'Barnet er særlig tilsynskrevende (§15-8 tredje ledd)',
    UTVIDELSE_FORSØRGER_I_UTDANNING: 'Forsørgeren er i utdanning (§15-8 andre ledd)',
    FORLENGELSE_MIDLERTIDIG_SYKDOM:
        'Forsørger eller barnet har en midlertidig sykdom (§15-8 fjerde ledd)',
    FORLENGELSE_STØNAD_UT_SKOLEÅRET: 'Stønad ut skoleåret (§15-8 andre ledd)',
    FORLENGELSE_STØNAD_PÅVENTE_ARBEID: 'Stønad i påvente av arbeid (§15-8 femte ledd)',
    FORLENGELSE_STØNAD_PÅVENTE_UTDANNING: 'Stønad i påvente av utdanning (§15-8 femte ledd)',
    FORLENGELSE_STØNAD_PÅVENTE_ARBEID_REELL_ARBEIDSSØKER:
        'Stønad i påvente av arbeid - reell arnbeidssøker (§15-8 femte ledd)',
    FORLENGELSE_STØNAD_PÅVENTE_OPPSTART_KVALIFISERINGSPROGRAM:
        'Stønad i påvente av oppstart kvalifiseringsprogram',
    FORLENGELSE_STØNAD_PÅVENTE_TILSYNSORDNING:
        'Stønad i påvente av tilsynsordning (§15-8 femte ledd)',
};

export const avslagÅrsakTilTekst: Record<EAvslagÅrsak, string> = {
    VILKÅR_IKKE_OPPFYLT: 'Vilkår ikke oppfylt',
    BARN_OVER_ÅTTE_ÅR: 'Barnet er over 8 år',
    STØNADSTID_OPPBRUKT: 'Stønadstiden er brukt opp',
    MANGLENDE_OPPLYSNINGER: 'Manglende opplysninger',
};

const sorterAktiviteterAlfabetisk = (a: EAktivitet, b: EAktivitet) =>
    aktivitetTilTekst[a] > aktivitetTilTekst[b] ? 1 : -1;

export const aktiviteterForPeriodetype = (periodeType: EPeriodetype): EAktivitet[] => {
    switch (periodeType) {
        case EPeriodetype.FORLENGELSE:
            return aktiviteterForlengelse.sort(sorterAktiviteterAlfabetisk);
        case EPeriodetype.UTVIDELSE:
            return aktiviteterUtvidelse.sort(sorterAktiviteterAlfabetisk);
        default:
            return (Object.keys(EAktivitet) as Array<EAktivitet>).sort(sorterAktiviteterAlfabetisk);
    }
};

export const aktiviteterForPeriodetypeHoved = (): EAktivitet[][] => {
    const ingen_plikt = aktiviteterHovedIngenPlikt.sort(sorterAktiviteterAlfabetisk);
    const fyller_plikt = aktiviteterHovedFyllerPlikt.sort(sorterAktiviteterAlfabetisk);
    const fyller_unntak = aktiviteterHovedFyllerUnntak.sort(sorterAktiviteterAlfabetisk);
    return [ingen_plikt, fyller_plikt, fyller_unntak];
};
