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
    ERSTATTET = 'ERSTATTET', // Deprecated
    SPLITTET = 'SPLITTET', // Deprecated
    ENDRET = 'ENDRET',
    ENDRING_I_INNTEKT = 'ENDRING_I_INNTEKT',
}

export const AndelHistorikkTypeTilTekst: Record<AndelEndringType, string> = {
    FJERNET: 'Fjernet',
    ERSTATTET: 'Erstattet',
    SPLITTET: 'Splittet',
    ENDRET: 'Endret', // Deprecated
    ENDRING_I_INNTEKT: 'Endring i inntekt', // Deprecated
};
