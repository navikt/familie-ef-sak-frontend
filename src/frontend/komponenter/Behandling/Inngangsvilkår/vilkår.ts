import { IMedlemskap } from './Medlemskap/typer';
import { IPersonDetaljer, ISivilstandInngangsvilkår } from './Sivilstand/typer';
import { IBosituasjon } from './Samliv/typer';
import { EDelvilkårÅrsak, IBarnMedSamvær } from './Aleneomsorg/typer';
import { ISagtOppEllerRedusertStilling } from '../../../typer/overgangsstønad';

export interface IVilkår {
    vurderinger: IVurdering[];
    grunnlag: IVilkårGrunnlag;
}

export interface IVilkårGrunnlag {
    medlemskap: IMedlemskap;
    sivilstand: ISivilstandInngangsvilkår;
    bosituasjon: IBosituasjon;
    sivilstandsplaner: ISivilstandsplaner;
    barnMedSamvær: IBarnMedSamvær[];
    sagtOppEllerRedusertStilling: ISagtOppEllerRedusertStilling;
}

export interface ISivilstandsplaner {
    harPlaner?: boolean;
    fraDato?: string;
    vordendeSamboerEktefelle?: IPersonDetaljer;
}

export interface IVurdering {
    id: string;
    resultat: Vilkårsresultat;
    behandlingId: string;
    barnId?: string;
    vilkårType: VilkårType;
    begrunnelse?: string | null;
    unntak?: UnntakType | null;
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
    årsak?: EDelvilkårÅrsak;
    begrunnelse?: string | null;
}

export enum Vilkårsresultat {
    OPPFYLT = 'OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    IKKE_AKTUELL = 'IKKE_AKTUELL',
    IKKE_VURDERT = 'IKKE_VURDERT',
}

export enum Redigeringsmodus {
    REDIGERING = 'REDIGERING',
    VISNING = 'VISNING',
    IKKE_PÅSTARTET = 'IKKE_PÅSTARTET',
}

export enum Vilkår {
    FORUTGÅENDE_MEDLEMSKAP = 'FORUTGÅENDE_MEDLEMSKAP',
    LOVLIG_OPPHOLD = 'LOVLIG_OPPHOLD',
    MOR_ELLER_FAR = 'MOR_ELLER_FAR',
    SIVILSTAND = 'SIVILSTAND',
    SAMLIV = 'SAMLIV',
    ALENEOMSORG = 'ALENEOMSORG',
    NYTT_BARN_SAMME_PARTNER = 'NYTT_BARN_SAMME_PARTNER',
    SAGT_OPP_ELLER_REDUSERT = 'SAGT_OPP_ELLER_REDUSERT',
}

export type VilkårType =
    | Vilkår.FORUTGÅENDE_MEDLEMSKAP
    | Vilkår.LOVLIG_OPPHOLD
    | Vilkår.MOR_ELLER_FAR
    | Vilkår.SIVILSTAND
    | Vilkår.SAMLIV
    | Vilkår.NYTT_BARN_SAMME_PARTNER
    | Vilkår.ALENEOMSORG
    | Vilkår.SAGT_OPP_ELLER_REDUSERT;

export const vilkårTypeTilTekst: Record<VilkårType, string> = {
    FORUTGÅENDE_MEDLEMSKAP: 'Vilkår om forutgående medlemskap',
    LOVLIG_OPPHOLD: 'Vilkår om opphold i Norge',
    MOR_ELLER_FAR: 'Vilkår om mor eller far',
    SIVILSTAND: 'Vilkår om sivilstand',
    SAMLIV: 'Vilkår om samliv',
    ALENEOMSORG: 'Vilkår om aleneomsorg',
    NYTT_BARN_SAMME_PARTNER: 'Vilkår om barn med samme partner',
    SAGT_OPP_ELLER_REDUSERT: 'Vilkår om sagt opp arbeidsforhold ',
};

// ------- DELVILKÅR

export enum DelvilkårType {
    FEM_ÅRS_MEDLEMSKAP = 'FEM_ÅRS_MEDLEMSKAP',
    BOR_OG_OPPHOLDER_SEG_I_NORGE = 'BOR_OG_OPPHOLDER_SEG_I_NORGE',
    DOKUMENTERT_EKTESKAP = 'DOKUMENTERT_EKTESKAP',
    DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE = 'DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE',
    KRAV_SIVILSTAND = 'KRAV_SIVILSTAND',
    SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON = 'SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON',
    SAMSVAR_DATO_SEPARASJON_OG_FRAFLYTTING = 'SAMSVAR_DATO_SEPARASJON_OG_FRAFLYTTING',
    LEVER_IKKE_MED_ANNEN_FORELDER = 'LEVER_IKKE_MED_ANNEN_FORELDER',
    LEVER_IKKE_I_EKTESKAPLIGNENDE_FORHOLD = 'LEVER_IKKE_I_EKTESKAPLIGNENDE_FORHOLD',
    SKRIFTLIG_AVTALE_OM_DELT_BOSTED = 'SKRIFTLIG_AVTALE_OM_DELT_BOSTED',
    NÆRE_BOFORHOLD = 'NÆRE_BOFORHOLD',
    MER_AV_DAGLIG_OMSORG = 'MER_AV_DAGLIG_OMSORG',
    OMSORG_FOR_EGNE_ELLER_ADOPTERTE_BARN = 'OMSORG_FOR_EGNE_ELLER_ADOPTERTE_BARN',
    HAR_FÅTT_ELLER_VENTER_NYTT_BARN_MED_SAMME_PARTNER = 'HAR_FÅTT_ELLER_VENTER_NYTT_BARN_MED_SAMME_PARTNER',
    SAGT_OPP_ELLER_REDUSERT = 'SAGT_OPP_ELLER_REDUSERT',
}

export const delvilkårTypeTilTekst: Record<DelvilkårType, string> = {
    FEM_ÅRS_MEDLEMSKAP: 'Har bruker vært medlem i folketrygden i de siste 5 årene?',
    BOR_OG_OPPHOLDER_SEG_I_NORGE: 'Bor og oppholder bruker og barna seg i Norge?',
    DOKUMENTERT_EKTESKAP: 'Foreligger det dokumentasjon på ekteskap?',
    DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE:
        'Foreligger det dokumentasjon på separasjon eller skilsmisse?',
    KRAV_SIVILSTAND: 'Er krav til sivilstand oppfylt?',
    SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON: 'Kan samlivsbrudd likestilles med formell separasjon?',
    SAMSVAR_DATO_SEPARASJON_OG_FRAFLYTTING:
        'Er det samsvar mellom datoene for separasjon og fraflytting?',
    LEVER_IKKE_MED_ANNEN_FORELDER:
        'Er vilkåret om å ikke leve sammen med den andre av barnets/barnas foreldre oppfylt?',
    LEVER_IKKE_I_EKTESKAPLIGNENDE_FORHOLD:
        'Er vilkåret om å ikke leve i et ekteskapslignende forhold i felles husholdning uten felles barn oppfylt?',
    SKRIFTLIG_AVTALE_OM_DELT_BOSTED: 'Har foreldrene inngått skriftlig avtale om delt bosted?',
    NÆRE_BOFORHOLD: 'Har bruker og den andre forelderen nære boforhold?',
    MER_AV_DAGLIG_OMSORG: 'Har bruker klart mer av den daglige omsorgen?',
    OMSORG_FOR_EGNE_ELLER_ADOPTERTE_BARN: 'Har bruker omsorgen for egne/adopterte barn? ',
    HAR_FÅTT_ELLER_VENTER_NYTT_BARN_MED_SAMME_PARTNER:
        'Har søker fått nytt barn med samme partner (født etter 01.01.2016) eller venter nytt barn med samme partner, etter at en av foreldrene tidligere har mottatt eller fortsatt mottar stønad for et annet felles barn.',
    SAGT_OPP_ELLER_REDUSERT:
        'Har søker sagt opp jobben, tatt frivillig permisjon eller redusert arbeidstiden de siste 6 månedene før søknadstidspunktet?',
};

// ------ UNNTAK

export enum UnntakType {
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    ARBEID_NORSK_ARBEIDSGIVER = 'ARBEID_NORSK_ARBEIDSGIVER',
    UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER = 'UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER',
    GJENLEVENDE_OVERTAR_OMSORG = 'GJENLEVENDE_OVERTAR_OMSORG',
    GJENLEVENDE_IKKE_RETT_TIL_YTELSER = 'GJENLEVENDE_IKKE_RETT_TIL_YTELSER',
    MEDLEM_MER_ENN_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR = 'MEDLEM_MER_ENN_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR',
    MEDLEM_MER_ENN_7_ÅR_AVBRUDD_MER_ENN_10ÅR = 'MEDLEM_MER_ENN_7_ÅR_AVBRUDD_MER_ENN_10ÅR',
    I_LANDET_FOR_GJENFORENING_ELLER_GIFTE_SEG = 'I_LANDET_FOR_GJENFORENING_ELLER_GIFTE_SEG',
    ANDRE_FORELDER_MEDLEM_SISTE_5_ÅR = 'ANDRE_FORELDER_MEDLEM_SISTE_5_ÅR',
    ANDRE_FORELDER_MEDLEM_MINST_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR = 'ANDRE_FORELDER_MEDLEM_MINST_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR',
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
    ANDRE_FORELDER_MEDLEM_MINST_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR:
        'Ja, medlem og bosatt når stønadstilfellet oppstod, den andre forelderen har vært medlem i minst fem år etter fylte 16 år når krav fremsettes, og avbruddet er mindre enn 10 år',
    ANDRE_FORELDER_MEDLEM_MINST_7_ÅR_AVBRUDD_MER_ENN_10_ÅR:
        'Ja, medlem og bosatt når stønadstilfellet oppstod, den andre forelderen har vært medlem i minst syv år etter fylte 16 år når krav fremsettes, og avbruddet er mer enn 10 år',
    ANDRE_FORELDER_MEDLEM_SISTE_5_ÅR:
        'Ja, medlem og bosatt når stønadstilfellet oppstod, den andre forelderen er bosatt og har vært medlem siste fem år',
    I_LANDET_FOR_GJENFORENING_ELLER_GIFTE_SEG:
        'Ja, medlem og bosatt når stønadstilfellet oppstod, kom til landet for gjenforening med ektefelle/samboer med felles barn, eller for å gifte seg med en som er bosatt, og hadde gyldig oppholdstillatelse ved ankomst',
    MEDLEM_MER_ENN_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR:
        'Ja, medlem i minst 5 år etter fylte 16 år når krav fremsettes, og avbruddet er mindre enn 10 år',
    MEDLEM_MER_ENN_7_ÅR_AVBRUDD_MER_ENN_10ÅR:
        'Ja, medlem i minst syv år etter fylte 16 år når krav fremsettes, og avbruddet er mer enn 10 år',
    TOTALVURDERING_OPPFYLLER_FORSKRIFT:
        'Ja, totalvurdering viser at forholdene går inn under forskriften om kravet om fem års forutgående medlemskap',
};

// ------ VILKÅRGRUPPE
/**
 * Gjør det mulig å splitte opp vurderinger i eks Medlemskap, Aleneomsorg, etc.
 * Når man eks legger til en vurdering til medlemskap i VurderingConfig nå så kommer den opp automatisk
 */
export enum VilkårGruppe {
    MEDLEMSKAP = 'MEDLEMSKAP',
    LOVLIG_OPPHOLD = 'LOVLIG_OPPHOLD',
    MOR_ELLER_FAR = 'MOR_ELLER_FAR',
    SIVILSTAND = 'SIVILSTAND',
    SAMLIV = 'SAMLIV',
    ALENEOMSORG = 'ALENEOMSORG',
    NYTT_BARN_SAMME_PARTNER = 'NYTT_BARN_SAMME_PARTNER',
    AKTIVITET = 'AKTIVITET',
    SAGT_OPP_ELLER_REDUSERT = 'SAGT_OPP_ELLER_REDUSERT',
}

export enum InngangsvilkårGruppe {
    MEDLEMSKAP = 'MEDLEMSKAP',
    LOVLIG_OPPHOLD = 'LOVLIG_OPPHOLD',
    MOR_ELLER_FAR = 'MOR_ELLER_FAR',
    SIVILSTAND = 'SIVILSTAND',
    SAMLIV = 'SAMLIV',
    ALENEOMSORG = 'ALENEOMSORG',
    NYTT_BARN_SAMME_PARTNER = 'NYTT_BARN_SAMME_PARTNER',
}

export enum AktivitetsvilkårGruppe {
    AKTIVITET = 'AKTIVITET',
    SAGT_OPP_ELLER_REDUSERT = 'SAGT_OPP_ELLER_REDUSERT',
}

export const vilkårsresultatTypeTilTekst: Record<Vilkårsresultat, string> = {
    OPPFYLT: 'Ja',
    IKKE_OPPFYLT: 'Nei',
    IKKE_VURDERT: 'Ikke vurdert',
    IKKE_AKTUELL: 'Ikke aktuell',
};
