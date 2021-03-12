import { DelvilkårType, Vilkårsresultat, vilkårsresultatTypeTilTekst } from './vilkår';

export const delvilkårTypeSomKreverSpesialhåntering: DelvilkårType[] = [
    DelvilkårType.NÆRE_BOFORHOLD,
    DelvilkårType.HAR_FÅTT_ELLER_VENTER_NYTT_BARN_MED_SAMME_PARTNER,
    DelvilkårType.SKRIFTLIG_AVTALE_OM_DELT_BOSTED,
    DelvilkårType.SAGT_OPP_ELLER_REDUSERT,
];

export const vilkårsresultatTypeTilTekstForDelvilkår = (
    vilkårsresultat: Vilkårsresultat,
    delvilkårType: DelvilkårType
): string => {
    return harDelvilkårNegertSpørsmålstilling(vilkårsresultat, delvilkårType)
        ? reverseVilkårsresultatTypeTilTekst(vilkårsresultat)
        : vilkårsresultatTypeTilTekst[vilkårsresultat];
};
const harDelvilkårNegertSpørsmålstilling = (
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
