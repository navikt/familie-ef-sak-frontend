import { IBarnMedSamværRegistergrunnlag, IBarnMedSamværSøknadsgrunnlag } from './typer';
import { utledNavnOgAlder } from '../utils';
import { Stønadstype } from '../../../../App/typer/behandlingstema.ts';

export const utledNavnOgAlderForAleneomsorg = (
    registergrunnlag?: IBarnMedSamværRegistergrunnlag,
    søknadsgrunnlag?: IBarnMedSamværSøknadsgrunnlag,
    stønadstype?: Stønadstype
) => {
    if (stønadstype === Stønadstype.BARNETILSYN) {
        return utledNavnOgAlder(
            registergrunnlag?.navn,
            registergrunnlag?.fødselsdato,
            registergrunnlag?.dødsdato,
            søknadsgrunnlag?.navn,
            søknadsgrunnlag?.fødselTermindato
        );
    } else {
        return registergrunnlag?.navn
            ? utledNavnOgAlder(
                  registergrunnlag?.navn,
                  registergrunnlag?.fødselsdato,
                  registergrunnlag?.dødsdato
              )
            : søknadsgrunnlag?.navn
              ? 'Ikke utfylt'
              : 'Ikke født';
    }
};
