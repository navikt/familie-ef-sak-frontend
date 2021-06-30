import { VilkårType } from '../Inngangsvilkår/vilkår';

export const delvilkårTypeTilTekst: Record<string, string> = {
    SØKER_MEDLEM_I_FOLKETRYGDEN: 'Har bruker vært medlem i folketrygden i de siste 5 årene?',
    BOR_OG_OPPHOLDER_SEG_I_NORGE: 'Bor og oppholder bruker og barna seg i Norge?',
    DOKUMENTERT_EKTESKAP: 'Foreligger det dokumentasjon på ekteskap?',
    DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE:
        'Foreligger det dokumentasjon på separasjon eller skilsmisse?',
    KRAV_SIVILSTAND_PÅKREVD_BEGRUNNELSE: 'Er krav til sivilstand oppfylt?',
    KRAV_SIVILSTAND_UTEN_PÅKREVD_BEGRUNNELSE: 'Er krav til sivilstand oppfylt?',
    SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON: 'Kan samlivsbruddet likestilles med formell separasjon?',
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
        'Har søker fått nytt barn med samme partner (født etter 01.01.2016) eller venter nytt barn med samme partner, etter at en av foreldrene tidligere har mottatt eller fortsatt mottar stønad for et annet felles barn?',
    SAGT_OPP_ELLER_REDUSERT:
        'Har søker sagt opp jobben, tatt frivillig permisjon eller redusert arbeidstiden de siste 6 månedene før søknadstidspunktet?',
    MEDLEMSKAP_UNNTAK: 'Er unntak fra hovedregelen oppfylt?',
    OPPHOLD_UNNTAK: 'Er unntak fra hovedregelen oppfylt?',
    FYLLER_BRUKER_AKTIVITETSPLIKT:
        'Fyller bruker aktivitetsplikt, unntak for aktivitetsplikt eller har barn under 1 år?',
    SIVILSTAND_UNNTAK: 'Er unntak fra krav om sivilstand oppfylt?',
    RIMELIG_GRUNN_SAGT_OPP:
        'Hadde søker rimelig grunn til å si opp jobben eller redusere arbeidstiden?',
    HAR_TIDLIGERE_MOTTATT_OVERGANSSTØNAD: 'Har søker tidligere mottatt overgangsstønad?',
    HAR_TIDLIGERE_ANDRE_STØNADER_SOM_HAR_BETYDNING:
        'Har søker tidligere mottatt andre stønader som har betydning for stønadstiden i §15-8 første og andre ledd?',
};

export const svarTypeTilTekst: Record<string, string> = {
    JA: 'Ja',
    NEI: 'Nei',
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
    RIMELIG_GRUNN_SAGT_OPP:
        'Hadde søker rimelig grunn til å si opp jobben eller redusere arbeidstiden?',
    SAMME_HUS_OG_FÆRRE_ENN_4_BOENHETER:
        'Ja, Søker bor i samme hus som den andre forelderen og huset har 4 eller færre boenheter',
    SAMME_HUS_OG_FLERE_ENN_4_BOENHETER_MEN_VURDERT_NÆRT:
        'Ja, Søker bor i samme hus som den andre forelderen og huset har flere enn 4 boenheter, men boforholdet er vurdert nært',
    SELVSTENDIGE_BOLIGER_SAMME_TOMT:
        'Ja, Foreldrene bor i selvstendige boliger på samme tomt eller gårdsbruk',
    SELVSTENDIGE_BOLIGER_SAMME_GÅRDSTUN:
        'Ja, Foreldrene bor i selvstendige boliger på samme gårdstun',
    NÆRMESTE_BOLIG_ELLER_REKKEHUS_I_SAMMEGATE:
        'Ja, Foreldrene bor i nærmeste bolig eller rekkehus i samme gate',
    TILSTØTENDE_BOLIGER_ELLER_REKKEHUS_I_SAMMEGATE:
        'Ja, Foreldrene bor i tilstøtende boliger eller rekkehus i samme gate',
};

export const vilkårTypeTilTekst: Record<VilkårType, string> = {
    AKTIVITET: 'Vilkår om aktivitet? Kanske',
    FORUTGÅENDE_MEDLEMSKAP: 'Vilkår om forutgående medlemskap',
    LOVLIG_OPPHOLD: 'Vilkår om opphold i Norge',
    MOR_ELLER_FAR: 'Vilkår om mor eller far',
    SIVILSTAND: 'Vilkår om sivilstand',
    SAMLIV: 'Vilkår om samliv',
    ALENEOMSORG: 'Vilkår om aleneomsorg',
    NYTT_BARN_SAMME_PARTNER: 'Vilkår om nytt barn med samme partner',
    SAGT_OPP_ELLER_REDUSERT: 'Vilkår om sagt opp arbeidsforhold ',
    TIDLIGERE_VEDTAKSPERIODER: 'Tidligere vedtaksperioder',
};
