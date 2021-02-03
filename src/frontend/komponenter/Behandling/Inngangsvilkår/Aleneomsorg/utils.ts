import { IAnnenForelderAleneomsorg } from './typer';
import { harVerdi } from '../../../../utils/utils';
import { formaterNullableFødsesnummer, formaterNullableIsoDato } from '../../../../utils/formatter';

export const hentAnnenForelderInfo = (
    forelder?: IAnnenForelderAleneomsorg,
    ikkeOppgittAnnenForelderBegrunnelse?: string
) => {
    const { navn, fødselsnummer, fødselsdato } = forelder || {};

    const erNavnFnrEllerFødselsdatoUtfylt: boolean =
        harVerdi(navn) || harVerdi(fødselsnummer) || harVerdi(fødselsdato);

    if (erNavnFnrEllerFødselsdatoUtfylt) {
        return `${navn || 'Ikke oppgitt navn'} - ${
            formaterNullableFødsesnummer(fødselsnummer) || formaterNullableIsoDato(fødselsdato)
        }`;
    } else {
        return `Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`;
    }
};
