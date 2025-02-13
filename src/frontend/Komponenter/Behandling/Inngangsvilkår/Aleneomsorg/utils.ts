import { IBarnMedSamværRegistergrunnlag, IBarnMedSamværSøknadsgrunnlag } from './typer';
import { utledNavnOgAlder } from '../utils';

export const utledNavnOgAlderForAleneomsorg = (
    registergrunnlag?: IBarnMedSamværRegistergrunnlag,
    søknadsgrunnlag?: IBarnMedSamværSøknadsgrunnlag
) =>
    registergrunnlag?.navn
        ? utledNavnOgAlder(
              registergrunnlag?.navn,
              registergrunnlag?.fødselsdato,
              registergrunnlag?.dødsdato
          )
        : søknadsgrunnlag?.navn
          ? 'Ikke utfylt'
          : 'Ikke født';
