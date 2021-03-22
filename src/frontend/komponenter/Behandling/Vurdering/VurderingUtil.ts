import {
    InngangsvilkårGruppe,
    IVurdering,
    Vilkårsresultat,
} from '../Inngangsvilkår/vilkår';
import { VilkårStatus } from '../../Felleskomponenter/Visning/VilkårOppfylt';

export const alleErOppfylte = (vurderinger: IVurdering[]): boolean =>
    vurderinger.every((vurdering) => vurdering.resultat === Vilkårsresultat.OPPFYLT);

export const vilkårStatus = (vurderinger: IVurdering[]): VilkårStatus => {
    if (alleErOppfylte(vurderinger)) {
        return VilkårStatus.OPPFYLT;
    } else if (
        vurderinger.some((vurdering) => vurdering.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL)
    ) {
        return VilkårStatus.IKKE_TATT_STILLING_TIL;
    } else {
        return VilkårStatus.IKKE_OPPFYLT;
    }
};
export const vilkårStatusAleneomsorg = (vurderinger: IVurdering[]): VilkårStatus => {
    const filtrerteVurderinger = vurderinger.filter(
        (vurdering) => vurdering.vilkårType === InngangsvilkårGruppe.ALENEOMSORG
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