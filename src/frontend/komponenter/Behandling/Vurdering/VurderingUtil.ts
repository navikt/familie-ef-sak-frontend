import { IVurdering, VilkårGruppe, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import { VurderingConfig } from '../Inngangsvilkår/config/VurderingConfig';

export const alleErOppfylte = (vurderinger: IVurdering[]): boolean =>
    vurderinger.filter((vurdering) => vurdering.resultat !== Vilkårsresultat.JA).length === 0;

export const filtrerVurderinger = (
    vurderinger: IVurdering[],
    vilkårGruppe: VilkårGruppe
): IVurdering[] =>
    vurderinger.filter((vurdering) => {
        const config = VurderingConfig[vurdering.vilkårType];
        if (!config) {
            console.error(`Savner config til ${vurdering.vilkårType}`);
            return false;
        }
        return config.vilkårGruppe === vilkårGruppe;
    });
