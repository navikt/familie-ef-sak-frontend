import { RegistergrunnlagNyttBarn, SøknadsgrunnlagNyttBarn } from './typer';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';

export const mapTilSøknadsgrunnlagNyttBarn = (
    barnMedSamvær: IBarnMedSamvær[]
): SøknadsgrunnlagNyttBarn[] => {
    return barnMedSamvær
        .filter((barn) => !barn.registergrunnlag.fødselsnummer)
        .map((barn) => ({
            navn: barn.søknadsgrunnlag.navn,
            fødselTermindato: barn.søknadsgrunnlag.fødselTermindato,
            fødselsnummer: barn.søknadsgrunnlag.fødselsnummer,
            annenForelderSoknad: barn.søknadsgrunnlag.forelder,
            ikkeOppgittAnnenForelderBegrunnelse:
                barn.søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse,
            erBarnetFødt: barn.søknadsgrunnlag.erBarnetFødt,
        }));
};

export const mapTilRegistergrunnlagNyttBarn = (
    barnMedSamvær: IBarnMedSamvær[]
): RegistergrunnlagNyttBarn[] => {
    return barnMedSamvær
        .map((barn) => ({
            navn: barn.registergrunnlag.navn,
            fødselsnummer: barn.registergrunnlag.fødselsnummer,
            annenForelderSoknad: barn.søknadsgrunnlag.forelder,
            annenForelderRegister: barn.registergrunnlag.forelder,
            ikkeOppgittAnnenForelderBegrunnelse:
                barn.søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse,
        }))
        .filter((barn) => barn.fødselsnummer);
};

export const mapBarnNavnTekst = (søknadsgrunnlagNyttBarn: SøknadsgrunnlagNyttBarn): string => {
    if (søknadsgrunnlagNyttBarn.navn) return søknadsgrunnlagNyttBarn.navn;
    if (søknadsgrunnlagNyttBarn.erBarnetFødt) return 'Ikke fylt ut';
    return 'Ikke født';
};
