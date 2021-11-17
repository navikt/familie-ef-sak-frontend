import {
    AktivitetsvilkårType,
    InngangsvilkårType,
    IVilkår,
    IVurdering,
    TidligereVedtaksperioderType,
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

export const eksistererVilkårsResultat = (
    vilkårstypeTilResultat: Record<VilkårType, [Vilkårsresultat]>,
    resultat: Vilkårsresultat
): boolean => {
    // @ts-ignore
    return [].concat(...Object.values(vilkårstypeTilResultat)).includes(resultat);
};

export const sorterUtInngangsvilkår = (vilkår: IVilkår): IVurdering[] => {
    return vilkår.vurderinger.filter((v) => v.vilkårType in InngangsvilkårType);
};

export const sorterUtAktivitetsVilkår = (vilkår: IVilkår): IVurdering[] => {
    return vilkår.vurderinger.filter((v) => v.vilkårType in AktivitetsvilkårType);
};

export const sorterUtTidligereVedtaksvilkår = (vilkår: IVilkår): IVurdering[] => {
    return vilkår.vurderinger.filter((v) => v.vilkårType in TidligereVedtaksperioderType);
};

export const erAlleVilkårOppfylt = (vilkår: IVilkår): boolean => {
    const alleOppfyltBortsettFraAleneomsorg = vilkår.vurderinger.every((vurdering: IVurdering) => {
        if (vurdering.vilkårType !== InngangsvilkårType.ALENEOMSORG) {
            return vurdering.resultat === Vilkårsresultat.OPPFYLT;
        } else {
            return true;
        }
    });

    const aleneomsorgOppfylt = vilkår.vurderinger
        .filter((vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG)
        .some((vurdering) => vurdering.resultat === Vilkårsresultat.OPPFYLT);

    return alleOppfyltBortsettFraAleneomsorg && aleneomsorgOppfylt;
};

export const eksistererIkkeOppfyltVilkår = (vilkår: IVilkår): boolean => {
    const inngangsvilkår = sorterUtInngangsvilkår(vilkår);
    const aktivitetsvilkår = sorterUtAktivitetsVilkår(vilkår);
    const inngangsvvilkårTilResultat = mapVilkårtypeTilResultat(inngangsvilkår);
    const aktivitetsvilkårTilResultat = mapVilkårtypeTilResultat(aktivitetsvilkår);
    return (
        eksistererVilkårsResultat(inngangsvvilkårTilResultat, Vilkårsresultat.IKKE_OPPFYLT) ||
        eksistererVilkårsResultat(aktivitetsvilkårTilResultat, Vilkårsresultat.IKKE_OPPFYLT)
    );
};
