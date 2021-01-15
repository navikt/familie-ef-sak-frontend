import { IPersonDetaljer } from '../Sivilstand/typer';
import { IDokumentasjon } from '../../../../typer/felles';

export interface IBosituasjon {
    delerDuBolig: ITekstalternativMedSvarId;
    samboer?: IPersonDetaljer;
    sammenflyttingsdato?: string;
    datoFlyttetFraHverandre?: string;
    tidligereSamboerFortsattRegistrertPåAdresse?: IDokumentasjon;
}

// TODO: Trekk ut
export interface ITekstalternativMedSvarId {
    verdi: string;
    svarId: ESøkerDelerBolig;
}

// TODO: Denne er kopiert rett ut fra familie-ef-søknad. Kanskje trekke ut til noe felles?
export enum ESøkerDelerBolig {
    borAleneMedBarnEllerGravid = 'borAleneMedBarnEllerGravid',
    borMidlertidigFraHverandre = 'borMidlertidigFraHverandre',
    borSammenOgVenterBarn = 'borSammenOgVenterBarn',
    harEkteskapsliknendeForhold = 'harEkteskapsliknendeForhold',
    delerBoligMedAndreVoksne = 'delerBoligMedAndreVoksne',
    tidligereSamboerFortsattRegistrertPåAdresse = 'tidligereSamboerFortsattRegistrertPåAdresse',
}
