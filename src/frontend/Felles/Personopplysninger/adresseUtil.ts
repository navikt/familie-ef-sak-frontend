import { IAdresse } from '../../App/typer/personopplysninger';
import { datoErEtterDagensDato } from '../../App/utils/utils';

export const gyldigTilOgMedErNullEllerFremITid = (adresse: IAdresse) =>
    !adresse.gyldigTilOgMed || datoErEtterDagensDato(adresse.gyldigTilOgMed);
