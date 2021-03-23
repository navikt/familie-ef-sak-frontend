import {
    InngangsvilkårType,
    IVurdering,
    Vilkårsresultat,
    VilkårType,
} from '../Inngangsvilkår/vilkår';
import { VilkårStatus } from '../../Felleskomponenter/Visning/VilkårOppfylt';

export const alleErOppfylte = (vurderinger: IVurdering[]): boolean =>
    vurderinger.every((vurdering) => vurdering.resultat === Vilkårsresultat.OPPFYLT);

export const vilkårStatus = (vurderinger: IVurdering[], vilkårGruppe: VilkårType): VilkårStatus => {
    const vurderingerForVilkårType = vurderinger.filter(
        (vurdering) => vurdering.vilkårType === vilkårGruppe
    );
    if (alleErOppfylte(vurderingerForVilkårType)) {
        return VilkårStatus.OPPFYLT;
    } else if (
        vurderingerForVilkårType.some(
            (vurdering) => vurdering.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL
        )
    ) {
        return VilkårStatus.IKKE_TATT_STILLING_TIL;
    } else {
        return VilkårStatus.IKKE_OPPFYLT;
    }
};
export const vilkårStatusAleneomsorg = (vurderinger: IVurdering[]): VilkårStatus => {
    const filtrerteVurderinger = vurderinger.filter(
        (vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG
    );

    if (filtrerteVurderinger.some((vurdering) => vurdering.resultat === Vilkårsresultat.OPPFYLT)) {
        return VilkårStatus.OPPFYLT;
    } else if (
        filtrerteVurderinger.every(
            (vurdering) => vurdering.resultat === Vilkårsresultat.IKKE_OPPFYLT
        )
    ) {
        return VilkårStatus.IKKE_OPPFYLT;
    } else {
        return VilkårStatus.IKKE_TATT_STILLING_TIL;
    }
};
