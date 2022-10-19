import { IBeløpsperiode } from './vedtak';

export interface MigreringInfoKanIkkeMigreres {
    kanMigreres: false;
    kanGåVidereTilJournalføring: boolean;
    årsak: string;
}
export interface MigreringInfoKanMigreres {
    kanMigreres: true;
    kanGåVidereTilJournalføring: false;
    stønadFom: string;
    stønadTom: string;
    inntektsgrunnlag: number;
    samordningsfradrag: number;
    beløpsperioder: IBeløpsperiode[];
}

export type MigreringInfoResponse = MigreringInfoKanMigreres | MigreringInfoKanIkkeMigreres;
