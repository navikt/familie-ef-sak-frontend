import { InfotrygdPeriode, Kode } from '../../App/typer/infotrygd';

export type InfotrygdPeriodeMedFlereEndringer = InfotrygdPeriode & {
    initiellKode?: Kode;
};
