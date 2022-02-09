import { InfotrygdPeriode, Kode } from '../../App/typer/infotrygd';

export type InfotrygdPeriodeMedFlereEndringer = InfotrygdPeriode & {
    initialKode?: Kode;
};
