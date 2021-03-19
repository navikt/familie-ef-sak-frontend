import { SivilstandType } from '../../../../typer/personopplysninger';

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
    årsakEnslig?: EÅrsakEnslig;
    tidligereSamboer?: IPersonDetaljer;
}

export interface IPersonDetaljer {
    navn: string;
    fødselsdato?: string;
    personIdent?: string;
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
}
