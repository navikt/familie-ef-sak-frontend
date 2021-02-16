import { SivilstandType } from '../../../../typer/personopplysninger';
import { DelvilkårType, IDelvilkår, Vilkårsresultat } from '../vilkår';

export const erSkiltEllerUgift = (sivilstandType: SivilstandType): boolean =>
    sivilstandType === SivilstandType.UGIFT ||
    sivilstandType === SivilstandType.SKILT ||
    sivilstandType === SivilstandType.SKILT_PARTNER ||
    sivilstandType === SivilstandType.UOPPGITT;

export const erEnkeEllerGjenlevendePartner = (sivilstandType: SivilstandType): boolean =>
    sivilstandType === SivilstandType.ENKE_ELLER_ENKEMANN ||
    sivilstandType === SivilstandType.GJENLEVENDE_PARTNER;

export const erIkkeUformeltGiftEllerSeparert = (
    erUformeltGift: boolean | undefined,
    erUformeltSeparertEllerSkilt: boolean | undefined
): boolean => !erUformeltGift || !erUformeltSeparertEllerSkilt;

export const erKravForSivilstandOppfylt = (delvilkår: IDelvilkår[]): boolean => {
    const delvilkårKravSivilstand: IDelvilkår | undefined = delvilkår.find(
        (delvilkår) => delvilkår.type === DelvilkårType.KRAV_SIVILSTAND
    );

    return delvilkårKravSivilstand?.resultat === Vilkårsresultat.OPPFYLT;
};
