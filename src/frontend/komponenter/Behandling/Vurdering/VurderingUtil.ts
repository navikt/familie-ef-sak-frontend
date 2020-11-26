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

const sistVurdertDelvilkårErOppfylt = (vurdering: IVurdering) => {
    const indexForFørsteIkkeVurderteDelvilkår = vurdering.delvilkårsvurderinger.findIndex(
        (value) => value.resultat === Vilkårsresultat.IKKE_VURDERT
    );
    return !(
        indexForFørsteIkkeVurderteDelvilkår === 0 ||
        vurdering.delvilkårsvurderinger[indexForFørsteIkkeVurderteDelvilkår - 1].resultat !==
            Vilkårsresultat.JA
    );
};

export const erGyldigVurdering = (vurdering: IVurdering): boolean => {
    // Må alltid ha med begrunnelse
    if (!vurdering.begrunnelse || vurdering.begrunnelse.trim().length === 0) {
        return false;
    }

    // Må ha satt resulat på vurderingen => vi har vurdert å flytte resultat på vurderingen til backend
    if (vurdering.resultat === Vilkårsresultat.IKKE_VURDERT) {
        return false;
    }

    // Hvis siste delvurdering er nei: valider unntak hvis det er definert unntak
    const sisteDelvurdering =
        vurdering.delvilkårsvurderinger[vurdering.delvilkårsvurderinger.length - 1];
    const alleDelvurderingerErVurdert = !vurdering.delvilkårsvurderinger.some(
        (delvurdering) => delvurdering.resultat === Vilkårsresultat.IKKE_VURDERT
    );
    if (alleDelvurderingerErVurdert && sisteDelvurdering.resultat === Vilkårsresultat.NEI) {
        const vilkårTypeHarIkkeUnntak = VurderingConfig[vurdering.vilkårType].unntak.length === 0;
        const harValgtUnntak = !!vurdering.unntak;

        return vilkårTypeHarIkkeUnntak || harValgtUnntak;
    } else if (alleDelvurderingerErVurdert) {
        return true;
    }

    return sistVurdertDelvilkårErOppfylt(vurdering);
};
