import { SivilstandType } from '../../../../typer/personopplysninger';
import { DelvilkårType, IDelvilkår, Vilkårsresultat } from '../vilkår';

export const erEnkeEllerGjenlevendePartner = (sivilstandType: SivilstandType): boolean =>
    sivilstandType === SivilstandType.ENKE_ELLER_ENKEMANN ||
    sivilstandType === SivilstandType.GJENLEVENDE_PARTNER;

export const erGiftSeparertEllerEnke = (sivilstandType: SivilstandType): boolean =>
    sivilstandType === SivilstandType.GIFT ||
    sivilstandType === SivilstandType.REGISTRERT_PARTNER ||
    sivilstandType === SivilstandType.SEPARERT ||
    sivilstandType === SivilstandType.SEPARERT_PARTNER ||
    sivilstandType === SivilstandType.ENKE_ELLER_ENKEMANN;

export const erSkiltOgKravIkkeOppfylt = (
    sivilstandType: SivilstandType,
    kravOmSivilstand: IDelvilkår
): boolean =>
    (sivilstandType === SivilstandType.SKILT_PARTNER || sivilstandType === SivilstandType.SKILT) &&
    kravOmSivilstand
        ? kravOmSivilstand.resultat === Vilkårsresultat.IKKE_OPPFYLT
        : false;
