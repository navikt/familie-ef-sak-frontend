import {
    AktivitetsvilkårType,
    InngangsvilkårType,
    IVilkår,
    Vilkårsresultat,
} from '../../Inngangsvilkår/vilkår';

export const barnSomOppfyllerAlleVilkår = (vilkår: IVilkår) => {
    const barnMedOppfyltAleneomsorg = vilkår.vurderinger
        .filter((vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG)
        .filter((vurdering) => vurdering.resultat === Vilkårsresultat.OPPFYLT)
        .map((vurdering) => vurdering.barnId);

    const barnMedOppfyltAldersvilkår = vilkår.vurderinger
        .filter((vurdering) => vurdering.vilkårType === AktivitetsvilkårType.ALDER_PÅ_BARN)
        .filter((vurdering) => vurdering.resultat === Vilkårsresultat.OPPFYLT)
        .map((vurdering) => vurdering.barnId);

    return vilkår.grunnlag.barnMedSamvær.filter(
        (barn) =>
            barnMedOppfyltAleneomsorg.includes(barn.barnId) &&
            barnMedOppfyltAldersvilkår.includes(barn.barnId)
    );
};
