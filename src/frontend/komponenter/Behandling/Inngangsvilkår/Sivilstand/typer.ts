import { SivilstandType } from '../../../../typer/personopplysninger';
import { ITekstalternativMedSvarId } from '../Samliv/typer';

export interface ISivilstandInngangsvilkår {
    søknadsgrunnlag: ISivilstandSøknadsgrunnlag;
    registergrunnlag: ISivilstandRegistergrunnlag;
}

export interface ISivilstandSøknadsgrunnlag {
    erUformeltGift?: boolean;
    erUformeltSeparertEllerSkilt?: boolean;
    søktOmSkilsmisseSeparasjon?: boolean;
    samlivsbruddsdato?: string;
    endringSamværsordningDato?: string;
    fraflytningsdato?: string;
    datoSøktSeparasjon?: string;
    årsakEnslig?: ITekstalternativMedSvarId<EÅrsakEnslig>;
    tidligereSamboer?: IPersonDetaljer;
}

export interface IPersonDetaljer {
    navn: string;
    fødselsdato?: string;
    ident?: string;
}
export interface ISivilstandRegistergrunnlag {
    type: SivilstandType;
    gyldigFraOgMed: string;
}
export enum EÅrsakEnslig {
    samlivsbruddForeldre = 'samlivsbruddForeldre',
    samlivsbruddAndre = 'samlivsbruddAndre',
    aleneFraFødsel = 'aleneFraFødsel',
    endringISamværsordning = 'endringISamværsordning',
    dødsfall = 'dødsfall',
    annet = 'annet',
}
