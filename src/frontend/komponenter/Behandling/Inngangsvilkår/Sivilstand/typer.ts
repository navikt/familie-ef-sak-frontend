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
    årsakEnslig?: string;
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
