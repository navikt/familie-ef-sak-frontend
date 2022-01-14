import { SivilstandType } from '../../../../App/typer/personopplysninger';

export interface ISivilstandInngangsvilkår {
    søknadsgrunnlag?: ISivilstandSøknadsgrunnlag;
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
    navn?: string;
    gyldigFraOgMed: string;
}
export enum EÅrsakEnslig {
    samlivsbruddForeldre = 'samlivsbruddForeldre',
    samlivsbruddAndre = 'samlivsbruddAndre',
    aleneFraFødsel = 'aleneFraFødsel',
    endringISamværsordning = 'endringISamværsordning',
    dødsfall = 'dødsfall',
}

export const ÅrsakEnsligTilTekst: Record<EÅrsakEnslig, string> = {
    samlivsbruddForeldre: 'Samlivsbrudd med den andre forelderen',
    samlivsbruddAndre: 'Samlivsbrudd med noen andre',
    aleneFraFødsel: 'Jeg er alene med barn fra fødsel',
    endringISamværsordning: 'Endring i omsorgen for barn',
    dødsfall: 'Jeg er alene med barn på grunn av dødsfall',
};
