import {
    InngangsvilkårType,
    IVurdering,
    Vilkårsresultat,
    VilkårType,
} from '../Behandling/Inngangsvilkår/vilkår';
import { vilkårStatusAleneomsorg } from '../Behandling/Vurdering/VurderingUtil';

export const mapVilkårtypeTilResultat = (
    vurderinger: IVurdering[]
): Record<VilkårType, [Vilkårsresultat]> => {
    return vurderinger.reduce((acc, vurdering) => {
        const list = acc[vurdering.vilkårType] ?? [];
        list.push(vurdering.resultat);
        acc[vurdering.vilkårType] = list;
        return acc;
    }, {} as Record<VilkårType, [Vilkårsresultat]>);
};

export const summerVilkårsresultat = (
    vilkårstypeTilResultat: Record<VilkårType, [Vilkårsresultat]>
): Record<Vilkårsresultat, number> => {
    return Object.entries(vilkårstypeTilResultat).reduce((acc, [type, resultatListe]) => {
        let resultat;
        if (type === InngangsvilkårType.ALENEOMSORG) {
            resultat = vilkårStatusAleneomsorg(resultatListe);
        } else {
            resultat = resultatListe[0];
        }
        acc[resultat] = (acc[resultat] ?? 0) + 1;
        return acc;
    }, {} as Record<Vilkårsresultat, number>);
};
