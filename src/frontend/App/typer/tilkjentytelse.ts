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

export interface AndelHistorikk {
    behandlingId: string;
    vedtakstidspunkt: string;
    saksbehandler: string;
    andel: AndelTilkjentYtelse;
    endring?: AndelHistorikkEndring;
    aktivitet: EAktivitet;
    periodeType: EPeriodetype;
    behandlingType: Behandlingstype;
    sanksjonsårsak?: Sanksjonsårsak;
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
