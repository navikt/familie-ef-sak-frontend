import { IBeløpsperiode } from './vedtak';

export interface MigreringInfoKanIkkeMigreres {
    kanMigreres: false;
    årsak: string;
}
export interface MigreringInfoKanMigreres {
    kanMigreres: true;
    stønadFom: string;
    stønadTom: string;
    inntektsgrunnlag: number;
    samordningsfradrag: number;
    beløpsperioder: IBeløpsperiode[];
}
export type MigreringInfoResponse = MigreringInfoKanMigreres | MigreringInfoKanIkkeMigreres;
