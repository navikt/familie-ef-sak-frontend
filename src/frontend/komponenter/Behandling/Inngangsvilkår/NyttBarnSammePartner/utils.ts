import { RegistergrunnlagNyttBarn, SøknadsgrunnlagNyttBarn } from './typer';
import { IAnnenForelder, IBarnMedSamvær } from '../Aleneomsorg/typer';
import { formaterNullableFødsesnummer, formaterNullableIsoDato } from '../../../../utils/formatter';

export const mapTilSøknadsgrunnlagNyttBarn = (
    barnMedSamvær: IBarnMedSamvær[]
): SøknadsgrunnlagNyttBarn[] => {
    return barnMedSamvær
        .filter((barn) => !barn.registergrunnlag.fødselsnummer)
        .map((barn) => ({
            navn: barn.søknadsgrunnlag.navn,
            terminDato: barn.søknadsgrunnlag.fødselTermindato,
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

export const mapForelderTilNavnOgFnr = (forelder?: IAnnenForelder): string | undefined => {
    if (forelder?.navn === 'ikke oppgitt') return undefined;
    return [
        forelder?.navn,
        forelder?.fødselsnummer
            ? formaterNullableFødsesnummer(forelder?.fødselsnummer)
            : formaterNullableIsoDato(forelder?.fødselsdato),
    ]
        .filter(Boolean)
        .join(' - ');
};

export const mapIkkeOppgitt = (ikkeOppgittAnnenForelderBegrunnelse?: string | null): string => {
    if (!ikkeOppgittAnnenForelderBegrunnelse) return '';
    return 'Donor' === ikkeOppgittAnnenForelderBegrunnelse
        ? 'Donor'
        : `Kan ikke oppgi: ${ikkeOppgittAnnenForelderBegrunnelse}`;
};

export const mapBarnNavnTekst = (søknadsgrunnlagNyttBarn: SøknadsgrunnlagNyttBarn): string => {
    if (søknadsgrunnlagNyttBarn.navn) return søknadsgrunnlagNyttBarn.navn;
    if (søknadsgrunnlagNyttBarn.erBarnetFødt) return 'Ikke fylt ut';
    return 'Ikke født';
};
