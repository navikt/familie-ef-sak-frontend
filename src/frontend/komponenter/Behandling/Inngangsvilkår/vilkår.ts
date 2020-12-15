import { IMedlemskap } from './Medlemskap/typer';
import { ISivilstandInngangsvilkår } from './Sivilstand/typer';

export interface IInngangsvilkår {
    vurderinger: IVurdering[];
    grunnlag: IInngangsvilkårGrunnlag;
}

export interface IInngangsvilkårGrunnlag {
    medlemskap: IMedlemskap;
    sivilstand: ISivilstandInngangsvilkår;
}

export interface IVurdering {
    id: string;
    resultat: Vilkårsresultat;
    behandlingId: string;
    vilkårType: VilkårType;
    begrunnelse?: string;
    unntak?: UnntakType;
    delvilkårsvurderinger: IDelvilkår[];
    endretAv: string;
    endretTid: string;
}

export interface Vurderingsfeilmelding {
    [Key: string]: string;
}

export interface IDelvilkår {
    type: DelvilkårType;
    resultat: Vilkårsresultat;
}

export enum Vilkårsresultat {
    JA = 'JA',
    NEI = 'NEI',
    IKKE_AKTUELL = 'IKKE_AKTUELL',
    IKKE_VURDERT = 'IKKE_VURDERT',
}

export enum Redigeringsmodus {
    REDIGERING = 'REDIGERING',
    VISNING = 'VISNING',
    IKKE_PÅSTARTET = 'IKKE_PÅSTARTET',
}

export const vilkårsresultatTypeTilTekst: Record<Vilkårsresultat, string> = {
    JA: 'Ja',
    NEI: 'Nei',
    IKKE_VURDERT: 'Ikke vurdert',
    IKKE_AKTUELL: 'Ikke aktuell',
};

export enum Vilkår {
    FORUTGÅENDE_MEDLEMSKAP = 'FORUTGÅENDE_MEDLEMSKAP',
    LOVLIG_OPPHOLD = 'LOVLIG_OPPHOLD',
    SIVILSTAND = 'SIVILSTAND',
}

export type VilkårType = Vilkår.FORUTGÅENDE_MEDLEMSKAP | Vilkår.LOVLIG_OPPHOLD | Vilkår.SIVILSTAND;

export const vilkårTypeTilTekst: Record<VilkårType, string> = {
    FORUTGÅENDE_MEDLEMSKAP: 'Vilkår om forutgående medlemskap',
    LOVLIG_OPPHOLD: 'Vilkår om opphold i Norge',
    SIVILSTAND: 'Vilkår om sivilstand',
};

// ------- DELVILKÅR

export enum DelvilkårType {
    TRE_ÅRS_MEDLEMSKAP = 'TRE_ÅRS_MEDLEMSKAP',
    DOKUMENTERT_FLYKTNINGSTATUS = 'DOKUMENTERT_FLYKTNINGSTATUS',
    BOR_OG_OPPHOLDER_SEG_I_NORGE = 'BOR_OG_OPPHOLDER_SEG_I_NORGE',
    DOKUMENTERT_EKTESKAP = 'DOKUMENTERT_EKTESKAP',
    DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE = 'DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE',
    KRAV_SIVILSTAND = 'KRAV_SIVILSTAND',
    SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON = 'SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON',
    SAMSVAR_DATO_SEPARASJON_OG_FRAFLYTTING = 'SAMSVAR_DATO_SEPARASJON_OG_FRAFLYTTING',
}

export const delvilkårTypeTilTekst: Record<DelvilkårType, string> = {
    TRE_ÅRS_MEDLEMSKAP: 'Har bruker vært medlem i folketrygden i de siste 3 årene?',
    DOKUMENTERT_FLYKTNINGSTATUS: 'Er flyktningstatus dokumentert?',
    BOR_OG_OPPHOLDER_SEG_I_NORGE: 'Bor og oppholder bruker og barna seg i Norge?',
    DOKUMENTERT_EKTESKAP: 'Foreligger det dokumentasjon på ekteskap?',
    DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE:
        'Foreligger det dokumentasjon på separasjon eller skilsmisse?',
    KRAV_SIVILSTAND: 'Er krav for sivilstand oppfylt?',
    SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON: 'Kan samlivsbrudd likestilles med formell separasjon?',
    SAMSVAR_DATO_SEPARASJON_OG_FRAFLYTTING:
        'Er det samsvar mellom datoene for separasjon og fraflytting?',
};

// ------ UNNTAK

export enum UnntakType {
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    ARBEID_NORSK_ARBEIDSGIVER = 'ARBEID_NORSK_ARBEIDSGIVER',
    UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER = 'UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER',
    GJENLEVENDE_OVERTAR_OMSORG = 'GJENLEVENDE_OVERTAR_OMSORG',
    GJENLEVENDE_IKKE_RETT_TIL_YTELSER = 'GJENLEVENDE_IKKE_RETT_TIL_YTELSER',
}

export const unntakTypeTilTekst: Record<UnntakType, string> = {
    IKKE_OPPFYLT: 'Nei',
    ARBEID_NORSK_ARBEIDSGIVER: 'Arbeid for norsk arbeidsgiver',
    UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER: 'Utenlandsopphold på mindre enn 6 uker',
    GJENLEVENDE_OVERTAR_OMSORG:
        'Ja, gjenlevende som etter dødsfallet overtar omsorgen for egne særkullsbarn',
    GJENLEVENDE_IKKE_RETT_TIL_YTELSER:
        'Ja, gjenlevende som etter dødsfallet får barn som avdøde ikke er mor/far til, og som ikke har rett til ytelser etter kap.17',
};

// ------ VILKÅRGRUPPE
/**
 * Gjør det mulig å splitte opp vurderinger i eks Medlemskap, Aleneomsorg, etc.
 * Når man eks legger til en vurdering til medlemskap i VurderingConfig nå så kommer den opp automatisk
 */
export enum VilkårGruppe {
    MEDLEMSKAP = 'MEDLEMSKAP',
    LOVLIG_OPPHOLD = 'LOVLIG_OPPHOLD',
    SIVILSTAND = 'SIVILSTAND',
}
