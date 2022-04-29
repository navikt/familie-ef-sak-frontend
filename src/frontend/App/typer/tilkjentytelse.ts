import { Behandlingstype } from './behandlingstype';
import { EAktivitet, EPeriodetype, ESamordningsfradragtype } from './vedtak';
import { Sanksjonsårsak } from './Sanksjonsårsak';

export interface TilkjentYtelse {
    andeler: AndelTilkjentYtelse[];
    samordningsfradragType: ESamordningsfradragtype | null;
}

export interface AndelTilkjentYtelse {
    stønadFra: string;
    stønadTil: string;
    inntekt: number;
    beløp: number;
    inntektsreduksjon: number;
    samordningsfradrag: number;
}

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
    tillegsstønad: number;
    sats: number;
    beløpFørSatsJustering: number;
}

export interface AndelHistorikk {
    behandlingId: string;
    vedtakstidspunkt: string;
    saksbehandler: string;
    andel: AndelMedGrunnlag;
    endring?: AndelHistorikkEndring;
    aktivitet?: EAktivitet;
    aktivitetArbeid?: AktivitetArbeid;
    erSanksjon: boolean;
    periodeType?: EPeriodetype;
    behandlingType: Behandlingstype;
    sanksjonsårsak?: Sanksjonsårsak;
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

export const AktivitetArbeidTilTekst: Record<AktivitetArbeid, string> = {
    ER_I_ARBEID: 'Er i arbeid',
    ETABLERER_EGEN_VIRKSOMHET: 'Etablerer egen virksomhet',
    HAR_FORBIGÅENDE_SYKDOM: 'Har forbigående sykdom',
    NEI: 'Nei',
};

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
