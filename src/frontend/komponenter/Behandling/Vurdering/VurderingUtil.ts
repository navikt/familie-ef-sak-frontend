import {
    InngangsvilkårType,
    IVurdering,
    Vilkårsresultat,
    VilkårType,
} from '../Inngangsvilkår/vilkår';

export const alleErOppfylte = (vurderinger: IVurdering[]): boolean =>
    vurderinger.every((vurdering) => vurdering.resultat === Vilkårsresultat.OPPFYLT);

export const vilkårsresultat = (
    vurderinger: IVurdering[],
    vilkårGruppe: VilkårType
): Vilkårsresultat => {
    const vurderingerForVilkårType = vurderinger.filter(
        (vurdering) => vurdering.vilkårType === vilkårGruppe
    );
    if (alleErOppfylte(vurderingerForVilkårType)) {
        return Vilkårsresultat.OPPFYLT;
    } else if (
        vurderingerForVilkårType.some(
            (vurdering) => vurdering.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL
        )
    ) {
        return Vilkårsresultat.IKKE_TATT_STILLING_TIL;
    } else {
        return Vilkårsresultat.IKKE_OPPFYLT;
    }
};
export const vilkårStatusAleneomsorg = (vurderinger: IVurdering[]): Vilkårsresultat => {
    const filtrerteVurderinger = vurderinger.filter(
        (vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG
    );

    if (filtrerteVurderinger.some((vurdering) => vurdering.resultat === Vilkårsresultat.OPPFYLT)) {
        return Vilkårsresultat.OPPFYLT;
    }
    if (
        filtrerteVurderinger.some(
            (vurdering) => vurdering.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL
        )
    ) {
        return Vilkårsresultat.IKKE_TATT_STILLING_TIL;
    }
    if (
        filtrerteVurderinger.every(
            (vurdering) => vurdering.resultat === Vilkårsresultat.SKAL_IKKE_VURDERES
        )
    ) {
        return Vilkårsresultat.SKAL_IKKE_VURDERES;
    }
    return Vilkårsresultat.IKKE_OPPFYLT;
};
