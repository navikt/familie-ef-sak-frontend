import { IPersonDetaljer } from '../Sivilstand/typer';
import { IDokumentasjon } from '../../../../typer/felles';

export interface IBosituasjon {
    delerDuBolig: ITekstalternativMedSvarId;
    samboer?: IPersonDetaljer;
    sammenflyttingsdato?: string;
    datoFlyttetFraHverandre?: string;
    tidligereSamboerFortsattRegistrertPåAdresse: IDokumentasjon;
}

export interface ITekstalternativMedSvarId {
    verdi: string;
    svarId: string;
}
