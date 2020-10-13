import { IVurdering, VilkårResultat } from '../Inngangsvilkår/vilkår';
import { VilkårDel, VurderingConfig } from './VurderingConfig';

export const alleErOppfylte = (vurderinger: IVurdering[]): boolean =>
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
    // Må alltid ha med begrunnelse
    if (!vurdering.begrunnelse || vurdering.begrunnelse.trim().length === 0) {
        return false;
    }

    // Må ha satt resulat på vurderingen => vi har vurdert å flytte resultat på vurderingen til backend
    if (vurdering.resultat === VilkårResultat.IKKE_VURDERT) {
        return false;
    }

    // Hvis siste delvurdering er nei: valider unntak hvis det er definert unntak
    const sisteDelvurdering =
        vurdering.delvilkårVurderinger[vurdering.delvilkårVurderinger.length - 1];
    const alleDelvurderingerErVurdert =
        vurdering.delvilkårVurderinger.filter(
            (delvurdering) => delvurdering.resultat === VilkårResultat.IKKE_VURDERT
        ).length === 0;
    if (alleDelvurderingerErVurdert && sisteDelvurdering.resultat === VilkårResultat.NEI) {
        if (VurderingConfig[vurdering.vilkårType].unntak) {
            return !!vurdering.unntak;
        } else {
            return true;
        }
    } else if (alleDelvurderingerErVurdert) {
        return true;
    }

    // Valider att siste vurderte delvilkår har resultat == JA
    const indexForFørsteIkkeVurderteDelvilkår = vurdering.delvilkårVurderinger.findIndex(
        (value) => value.resultat === VilkårResultat.IKKE_VURDERT
    );
    return !(
        indexForFørsteIkkeVurderteDelvilkår === 0 ||
        vurdering.delvilkårVurderinger[indexForFørsteIkkeVurderteDelvilkår - 1].resultat !==
            VilkårResultat.JA
    );
};
