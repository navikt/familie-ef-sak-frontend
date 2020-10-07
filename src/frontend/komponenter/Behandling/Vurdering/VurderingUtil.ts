import { IVurdering, VilkårResultat } from '../Inngangsvilkår/vilkår';
import { VilkårDel, VurderingConfig } from './VurderingConfig';

export const alleErOppfylte = (vurderinger: IVurdering[]) =>
    vurderinger.filter((vurdering) => vurdering.resultat !== VilkårResultat.JA).length === 0;

export const filtrerVurderinger = (vurderinger: IVurdering[], vilkårDel: VilkårDel): IVurdering[] =>
    vurderinger.filter((vurdering) => {
        const config = VurderingConfig[vurdering.vilkårType];
        if (!config) {
            console.error('Savner config');
            return false;
        }
        return config.vilkårDel === vilkårDel;
    });
