import { DelvilkårType, Vilkårsresultat, vilkårsresultatTypeTilTekst } from './vilkår';

export const delvilkårTypeSomKreverSpesialhåntering: DelvilkårType[] = [
    DelvilkårType.NÆRE_BOFORHOLD,
    DelvilkårType.SKRIFTLIG_AVTALE_OM_DELT_BOSTED,
];

export const vilkårsresultatTypeTilTekstForDelvilkår = (
    vilkårsresultat: Vilkårsresultat,
    delvilkårType: DelvilkårType
): string => {
    return erDelvilkårOppfyltHvisSvaretErNei(vilkårsresultat, delvilkårType)
        ? reverseVilkårsresultatTypeTilTekst(vilkårsresultat)
        : vilkårsresultatTypeTilTekst[vilkårsresultat];
};
const erDelvilkårOppfyltHvisSvaretErNei = (
    vilkårsresultat: Vilkårsresultat,
    delvilkårType: DelvilkårType
): boolean => {
    return (
        delvilkårTypeSomKreverSpesialhåntering.includes(delvilkårType) &&
        (vilkårsresultat === Vilkårsresultat.IKKE_OPPFYLT ||
            vilkårsresultat === Vilkårsresultat.OPPFYLT)
    );
};

const reverseVilkårsresultatTypeTilTekst = (vilkårsresultat: Vilkårsresultat): string => {
    if (vilkårsresultat === Vilkårsresultat.OPPFYLT)
        return vilkårsresultatTypeTilTekst[Vilkårsresultat.IKKE_OPPFYLT];
    return vilkårsresultatTypeTilTekst[Vilkårsresultat.OPPFYLT];
};
