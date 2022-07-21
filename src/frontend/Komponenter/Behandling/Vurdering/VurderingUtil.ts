import { IVurdering, Vilkårsresultat, VilkårType } from '../Inngangsvilkår/vilkår';

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
export const vilkårStatusForBarn = (vilkårsresultater: Vilkårsresultat[]): Vilkårsresultat => {
    if (
        vilkårsresultater.some((vurdering) => vurdering === Vilkårsresultat.IKKE_TATT_STILLING_TIL)
    ) {
        return Vilkårsresultat.IKKE_TATT_STILLING_TIL;
    }
    if (vilkårsresultater.some((vurdering) => vurdering === Vilkårsresultat.OPPFYLT)) {
        return Vilkårsresultat.OPPFYLT;
    }
    if (vilkårsresultater.every((vurdering) => vurdering === Vilkårsresultat.SKAL_IKKE_VURDERES)) {
        return Vilkårsresultat.SKAL_IKKE_VURDERES;
    }
    return Vilkårsresultat.IKKE_OPPFYLT;
};
