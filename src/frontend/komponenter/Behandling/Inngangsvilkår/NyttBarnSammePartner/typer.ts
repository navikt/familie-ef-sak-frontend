import { IAnnenForelder } from '../Aleneomsorg/typer';

export interface RegistergrunnlagNyttBarn {
    navn?: string;
    fødselsnummer?: string;
    annenForelderSoknad?: IAnnenForelder;
    annenForelderRegister?: IAnnenForelder;
    ikkeOppgittAnnenForelderBegrunnelse?: string;
}

export interface SøknadsgrunnlagNyttBarn {
    navn?: string;
    fødselTermindato?: string;
    annenForelderSoknad?: IAnnenForelder;
    ikkeOppgittAnnenForelderBegrunnelse?: string;
}
