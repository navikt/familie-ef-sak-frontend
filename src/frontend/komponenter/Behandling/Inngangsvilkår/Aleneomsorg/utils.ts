import {
    EIkkeOppgittAnnenForelderÅrsak,
    IAnnenForelderAleneomsorg,
    ikkeOppgittAnnenForelderÅrsakTilTekst,
} from './typer';

export const hentAnnenForelderInfo = (
    forelder?: IAnnenForelderAleneomsorg,
    ikkeOppgittAnnenForelderÅrsak?: EIkkeOppgittAnnenForelderÅrsak
) => {
    const erNavnFnrEllerFødselsdatoUtfylt: boolean =
        forelder?.navn !== '' || forelder.fødselsnummer !== '' || forelder.fødselsdato !== '';

    if (forelder) {
        return !erNavnFnrEllerFødselsdatoUtfylt
            ? 'Ikke fylt ut'
            : `${forelder?.navn}, ${forelder?.fødselsnummer}`;
    } else {
        return ikkeOppgittAnnenForelderÅrsak === EIkkeOppgittAnnenForelderÅrsak.donorbarn
            ? ikkeOppgittAnnenForelderÅrsakTilTekst[EIkkeOppgittAnnenForelderÅrsak.donorbarn]
            : ikkeOppgittAnnenForelderÅrsakTilTekst[EIkkeOppgittAnnenForelderÅrsak.annet];
    }
};
