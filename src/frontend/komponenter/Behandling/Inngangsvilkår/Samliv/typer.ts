import { IPersonDetaljer } from '../Sivilstand/typer';
import { IDokumentasjon } from '../../../../typer/felles';

export interface IBosituasjon {
    delerDuBolig: ITekstalternativMedSvarId<ESøkerDelerBolig>;
    samboer?: IPersonDetaljer;
    sammenflyttingsdato?: string;
    datoFlyttetFraHverandre?: string;
    tidligereSamboerFortsattRegistrertPåAdresse?: IDokumentasjon;
}

// TODO: Trekk ut
export interface ITekstalternativMedSvarId<T> {
    verdi: string;
    svarId: T;
}

export enum ESøkerDelerBolig {
    borAleneMedBarnEllerGravid = 'borAleneMedBarnEllerGravid',
    borMidlertidigFraHverandre = 'borMidlertidigFraHverandre',
    borSammenOgVenterBarn = 'borSammenOgVenterBarn',
    harEkteskapsliknendeForhold = 'harEkteskapsliknendeForhold',
    delerBoligMedAndreVoksne = 'delerBoligMedAndreVoksne',
    tidligereSamboerFortsattRegistrertPåAdresse = 'tidligereSamboerFortsattRegistrertPåAdresse',
}
