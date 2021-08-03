import {
    InngangsvilkårType,
    IVurdering,
    Vilkårsresultat,
    VilkårType,
} from '../Inngangsvilkår/vilkår';
import { vilkårStatusAleneomsorg } from '../Vurdering/VurderingUtil';

export const mapVilkårtypeTilResultat = (
    vurderinger: IVurdering[]
): Record<VilkårType, [Vilkårsresultat]> => {
    return vurderinger.reduce((acc, vurdering) => {
        const listeMedVilkårsresultat = acc[vurdering.vilkårType] ?? [];
        listeMedVilkårsresultat.push(vurdering.resultat);
        acc[vurdering.vilkårType] = listeMedVilkårsresultat;
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
            // alle andre vilkår har kun ett resultat
            resultat = resultatListe[0];
        }
        acc[resultat] = (acc[resultat] ?? 0) + 1;
        return acc;
    }, {} as Record<Vilkårsresultat, number>);
};
