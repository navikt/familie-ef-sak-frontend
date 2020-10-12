import { IVurdering, VilkårResultat } from '../Inngangsvilkår/vilkår';
import { VilkårDel, VurderingConfig } from './VurderingConfig';

export const alleErOppfylte = (vurderinger: IVurdering[]) =>
    vurderinger.filter((vurdering) => vurdering.resultat !== VilkårResultat.JA).length === 0;

export const filtrerVurderinger = (vurderinger: IVurdering[], vilkårDel: VilkårDel): IVurdering[] =>
    vurderinger.filter((vurdering) => {
        const config = VurderingConfig[vurdering.vilkårType];
        if (!config) {
            console.error(`Savner config til ${vurdering.vilkårType}`);
            return false;
        }
        return config.vilkårDel === vilkårDel;
    });

export const erGyldigVurdering = (vurdering: IVurdering): boolean => {
    if (
        vurdering.resultat === VilkårResultat.IKKE_VURDERT ||
        !vurdering.begrunnelse ||
        vurdering.begrunnelse.trim().length === 0
    ) {
        return false;
    } else if (vurdering.resultat === VilkårResultat.JA) {
        if (VurderingConfig[vurdering.vilkårType].unntak) {
            return !!vurdering.unntak;
        } else {
            return true;
        }
    } else return vurdering.resultat === VilkårResultat.NEI;
};
