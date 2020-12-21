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
    MEDLEM_MER_ENN_3_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR = 'MEDLEM_MER_ENN_3_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR',
    MEDLEM_MER_ENN_7_ÅR_AVBRUDD_MER_ENN_10ÅR = 'MEDLEM_MER_ENN_7_ÅR_AVBRUDD_MER_ENN_10ÅR',
    I_LANDET_FOR_GJENFORENING_ELLER_GIFTE_SEG = 'I_LANDET_FOR_GJENFORENING_ELLER_GIFTE_SEG',
    ANDRE_FORELDER_MEDLEM_SISTE_3_ÅR = 'ANDRE_FORELDER_MEDLEM_SISTE_3_ÅR',
    ANDRE_FORELDER_MEDLEM_MINST_3_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR = 'ANDRE_FORELDER_MEDLEM_MINST_3_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR',
    ANDRE_FORELDER_MEDLEM_MINST_7_ÅR_AVBRUDD_MER_ENN_10_ÅR = 'ANDRE_FORELDER_MEDLEM_MINST_7_ÅR_AVBRUDD_MER_ENN_10_ÅR',
    TOTALVURDERING_OPPFYLLER_FORSKRIFT = 'TOTALVURDERING_OPPFYLLER_FORSKRIFT',
}

export const unntakTypeTilTekst: Record<UnntakType, string> = {
    IKKE_OPPFYLT: 'Nei',
    ARBEID_NORSK_ARBEIDSGIVER: 'Arbeid for norsk arbeidsgiver',
    UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER: 'Utenlandsopphold på mindre enn 6 uker',
    GJENLEVENDE_OVERTAR_OMSORG:
        'Ja, gjenlevende som etter dødsfallet overtar omsorgen for egne særkullsbarn',
    GJENLEVENDE_IKKE_RETT_TIL_YTELSER:
        'Ja, gjenlevende som etter dødsfallet får barn som avdøde ikke er mor/far til, og som ikke har rett til ytelser etter kap.17',
    ANDRE_FORELDER_MEDLEM_MINST_3_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR:
        'Medlem og bosatt når stønadstilfellet oppstod, den andre forelderen har vært medlem i minst tre år (eventuelt fem år) etter fylte 16 år når krav fremsettes, og avbruddet er mindre enn 10 år',
    ANDRE_FORELDER_MEDLEM_MINST_7_ÅR_AVBRUDD_MER_ENN_10_ÅR:
        'Medlem og bosatt når stønadstilfellet oppstod, den andre forelderen har vært medlem i minst syv år etter fylte 16 år når krav fremsettes, og avbruddet er mer enn 10 år',
    ANDRE_FORELDER_MEDLEM_SISTE_3_ÅR:
        'Medlem og bosatt når stønadstilfellet oppstod, den andre forelderen er bosatt og har vært medlem siste tre år',
    I_LANDET_FOR_GJENFORENING_ELLER_GIFTE_SEG:
        'Medlem og bosatt når stønadstilfellet oppstod, kom til landet for gjenforening med ektefelle/samboer med felles barn, eller for å gifte seg med en som er bosatt, og hadde gyldig oppholdstillatelse ved ankomst',
    MEDLEM_MER_ENN_3_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR:
        'Medlem i minst tre år (eventuelt fem år) etter fylte 16 år når krav fremsettes, og avbruddet er mindre enn 10 å',
    MEDLEM_MER_ENN_7_ÅR_AVBRUDD_MER_ENN_10ÅR:
        'Medlem i minst syv år etter fylte 16 år når krav fremsettes, og avbruddet er mer enn 10 år',
    TOTALVURDERING_OPPFYLLER_FORSKRIFT:
        'Totalvurdering viser at forholdene går inn under forskriften om kravet om tre års (eventuelt fem års) forutgående medlemskap',
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
