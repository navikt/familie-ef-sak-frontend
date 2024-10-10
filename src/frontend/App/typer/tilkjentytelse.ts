import { Behandlingstype } from './behandlingstype';
import { EAktivitet, EPeriodetype, EUtgiftsperiodeAktivitet, EUtgiftsperiodetype } from './vedtak';
import { Sanksjonsårsak } from './Sanksjonsårsak';
import { Behandlingsårsak } from './behandlingsårsak';

export interface AndelMedGrunnlag {
    stønadFra: string;
    stønadTil: string;
    inntekt: number;
    beløp: number;
    inntektsreduksjon: number;
    samordningsfradrag: number;
    utgifter: number;
    antallBarn: number;
    kontantstøtte: number;
    tilleggsstønad: number;
    sats: number;
    beløpFørFratrekkOgSatsJustering: number;
    beregnetAntallMåneder: number;
}

export interface AndelHistorikk {
    behandlingId: string;
    vedtakstidspunkt: string;
    saksbehandler: string;
    andel: AndelMedGrunnlag;
    endring?: AndelHistorikkEndring;
    aktivitet?: EAktivitet;
    aktivitetBarnetilsyn?: EUtgiftsperiodeAktivitet;
    aktivitetArbeid?: AktivitetArbeid;
    periodeType?: EPeriodetype;
    periodetypeBarnetilsyn?: EUtgiftsperiodetype;
    behandlingType: Behandlingstype;
    behandlingÅrsak: Behandlingsårsak;
    sanksjonsårsak?: Sanksjonsårsak;
    erOpphør: boolean;
}

export interface AndelHistorikkEndring {
    type: AndelEndringType;
    behandlingId: string;
    vedtakstidspunkt: string;
}

export enum AktivitetArbeid {
    ER_I_ARBEID = 'ER_I_ARBEID',
    ETABLERER_EGEN_VIRKSOMHET = 'ETABLERER_EGEN_VIRKSOMHET',
    HAR_FORBIGÅENDE_SYKDOM = 'HAR_FORBIGÅENDE_SYKDOM',
    NEI = 'NEI',
}

export enum AndelEndringType {
    FJERNET = 'FJERNET',
    ERSTATTET = 'ERSTATTET',
    SPLITTET = 'SPLITTET',
}

export const AndelHistorikkTypeTilTekst: Record<AndelEndringType, string> = {
    FJERNET: 'Fjernet',
    ERSTATTET: 'Erstattet',
    SPLITTET: 'Splittet',
};
