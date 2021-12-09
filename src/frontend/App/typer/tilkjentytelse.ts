import { Behandlingstype } from './behandlingstype';
import { EAktivitet, EPeriodetype } from './vedtak';

export interface TilkjentYtelse {
    andeler: AndelTilkjentYtelse[];
}

export interface AndelTilkjentYtelse {
    stønadFra: string;
    stønadTil: string;
    inntekt: number;
    beløp: number;
    inntektsreduksjon: number;
    samordningsfradrag: number;
}

export interface AndelHistorikk {
    behandlingId: string;
    vedtakstidspunkt: string;
    saksbehandler: string;
    andel: AndelTilkjentYtelse;
    endring?: AndelHistorikkEndring;
    aktivitet: EAktivitet;
    periodeType: EPeriodetype;
    behandlingType: Behandlingstype;
}

export interface AndelHistorikkEndring {
    type: AndelEndringType;
    behandlingId: string;
    vedtakstidspunkt: string;
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
