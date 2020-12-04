import { IDelvilkår, IVurdering, VilkårGruppe, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import { IVilkårConfig, VurderingConfig } from '../Inngangsvilkår/config/VurderingConfig';
import { SivilstandType } from '../../../typer/personopplysninger';

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
export const harBesvartPåAlleDelvilkår = (delvilkårsvurderinger: IDelvilkår[]): boolean =>
    !delvilkårsvurderinger.some((delvilkår) => delvilkår.resultat === Vilkårsresultat.IKKE_VURDERT);

export const skalViseLagreKnapp = (vurdering: IVurdering, config: IVilkårConfig): boolean => {
    const { begrunnelse, delvilkårsvurderinger } = vurdering;
    // Må alltid ha med begrunnelse
    if (!begrunnelse || begrunnelse.trim().length === 0) {
        return false;
    }
    const besvarteDelvilkår = delvilkårsvurderinger.filter(
        (delvilkår) =>
            delvilkår.resultat === Vilkårsresultat.NEI || delvilkår.resultat === Vilkårsresultat.JA
    );
    //Må ha besvart minimum 1 delvilkår
    if (besvarteDelvilkår.length === 0) {
        return false;
    }
    const sisteBesvarteDelvilkår = besvarteDelvilkår[besvarteDelvilkår.length - 1];

    const vurderingErOppfylt = sisteBesvarteDelvilkår.resultat === Vilkårsresultat.JA;

    if (vurderingErOppfylt) {
        return true;
    } else if (harBesvartPåAlleDelvilkår(delvilkårsvurderinger)) {
        const harUnntak = config.unntak.length !== 0;
        return harUnntak ? !!vurdering.unntak : true;
    }
    return false;
};

export const skalViseLagreKnappSivilstand = (
    vurdering: IVurdering,
    config: IVilkårConfig,
    sivilstandType: SivilstandType
): boolean => {
    const { begrunnelse, delvilkårsvurderinger } = vurdering;
    // Må alltid ha med begrunnelse
    if (!begrunnelse || begrunnelse.trim().length === 0) {
        return false;
    }
    const besvarteDelvilkår = delvilkårsvurderinger.filter(
        (delvilkår) =>
            delvilkår.resultat === Vilkårsresultat.NEI || delvilkår.resultat === Vilkårsresultat.JA
    );
    //Må ha besvart minimum 1 delvilkår
    if (besvarteDelvilkår.length === 0 && !vurdering.unntak) {
        return false;
    }

    if (harBesvartPåAlleDelvilkår(delvilkårsvurderinger)) {
        if (sivilstandType === SivilstandType.ENKE_ELLER_ENKEMANN) {
            const harUnntak = config.unntak.length !== 0;
            return harUnntak ? !!vurdering.unntak : true;
        } else return true;
    }
    return false;
};
