import { IAnnenForelder } from '../Aleneomsorg/typer';

export interface RegistergrunnlagNyttBarn {
    navn?: string;
    fødselsnummer?: string;
    annenForelderSoknad?: IAnnenForelder;
    annenForelderRegister?: IAnnenForelder;
    ikkeOppgittAnnenForelderBegrunnelse?: string;
    dødsdato?: string;
}

export interface SøknadsgrunnlagNyttBarn {
    navn?: string;
    fødselTermindato?: string;
    annenForelderSoknad?: IAnnenForelder;
    annenForelderRegister?: IAnnenForelder;
    ikkeOppgittAnnenForelderBegrunnelse?: string;
}
