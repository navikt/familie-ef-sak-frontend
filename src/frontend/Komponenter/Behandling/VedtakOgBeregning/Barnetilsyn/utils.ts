import { IVilkår, Vilkårsresultat } from '../../Inngangsvilkår/vilkår';
import { IUtgiftsperiode } from '../../../../App/typer/vedtak';
import { v4 as uuidv4 } from 'uuid';

export const barnSomOppfyllerAlleVilkår = (vilkår: IVilkår) => {
    const barnSomIkkeOppfyllerVilkår = vilkår.vurderinger
        .filter(
            (vurdering) =>
                vurdering.resultat !== Vilkårsresultat.OPPFYLT &&
                vurdering.resultat !== Vilkårsresultat.AUTOMATISK_OPPFYLT
        )
        .map((vurdering) => vurdering.barnId);

    return vilkår.grunnlag.barnMedSamvær.filter(
        (barn) => !barnSomIkkeOppfyllerVilkår.includes(barn.barnId)
    );
};

export const tomUtgiftsperiodeRad = (årMånedFra?: string): IUtgiftsperiode => ({
    årMånedFra: årMånedFra || '',
    årMånedTil: '',
    barn: [],
    utgifter: undefined,
    erMidlertidigOpphør: false,
    endretKey: uuidv4(),
});
