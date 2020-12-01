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
}
export interface ISivilstandRegistergrunnlag {
    type: SivilstandType;
    gyldigFraOgMed: string;
}
