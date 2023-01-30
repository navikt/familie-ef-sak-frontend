import { IAnnenForelder } from '../Aleneomsorg/typer';

export interface RegistergrunnlagNyttBarn {
    barnId: string;
    navn?: string;
    fødselsnummer?: string;
    fødselsdato?: string;
    annenForelderSoknad?: IAnnenForelder;
    annenForelderRegister?: IAnnenForelder;
    ikkeOppgittAnnenForelderBegrunnelse?: string;
    dødsdato?: string;
}

export interface SøknadsgrunnlagNyttBarn {
    barnId: string;
    navn?: string;
    fødselTermindato?: string;
    annenForelderSoknad?: IAnnenForelder;
    annenForelderRegister?: IAnnenForelder;
    ikkeOppgittAnnenForelderBegrunnelse?: string;
}
