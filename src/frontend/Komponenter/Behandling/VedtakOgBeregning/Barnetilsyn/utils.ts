import { IVilkår, Vilkårsresultat } from '../../Inngangsvilkår/vilkår';

export const barnSomOppfyllerAlleVilkår = (vilkår: IVilkår) => {
    const barnSomIkkeOppfyllerVilkår = vilkår.vurderinger
        .filter((vurdering) => vurdering.resultat !== Vilkårsresultat.OPPFYLT)
        .map((vurdering) => vurdering.barnId);

    return vilkår.grunnlag.barnMedSamvær.filter(
        (barn) => !barnSomIkkeOppfyllerVilkår.includes(barn.barnId)
    );
};
