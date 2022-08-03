import {IBeløpsperiode} from './vedtak';

export enum Migreringsstatus {
    ER_MIGRERT = 'ER_MIGRERT',
    KAN_GÅ_VIDERE_TIL_JOURNALFØRING = 'KAN_GÅ_VIDERE_TIL_JOURNALFØRING',
}

export interface MigreringInfoKanIkkeMigreres {
    kanMigreres: false;
    kanGåVidereTilJournalføring: boolean;
    årsak: string;
}

export interface MigreringInfoKanMigreres {
    kanMigreres: true;
    kanGåVidereTilJournalføring: false;
    stønadsperiode: { fomMåned: String, tomMåned: String }
    inntektsgrunnlag: number;
    samordningsfradrag: number;
    beløpsperioder: IBeløpsperiode[];
}

export type MigreringInfoResponse = MigreringInfoKanMigreres | MigreringInfoKanIkkeMigreres;
