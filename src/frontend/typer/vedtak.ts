import { PeriodeVariant } from '../komponenter/Felleskomponenter/MånedÅr/MånedÅrPeriode';

export interface IVedtak {
    resultatType: EBehandlingResultat;
    periodeBegrunnelse: string;
    inntektBegrunnelse: string;
    perioder: IVedtaksperiode[];
}

export interface IVedtaksperiode {
    periodeType: EPeriodetype;
    aktivitet: EAktivitet;
    årMånedFra?: string;
    årMånedTil?: string;
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
