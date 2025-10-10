export const eldreUnntaksregler = [
    'MEDLEM_MER_ENN_7_ÅR_AVBRUDD_MER_ENN_10ÅR',
    'ANDRE_FORELDER_MEDLEM_MINST_7_ÅR_AVBRUDD_MER_ENN_10_ÅR',
    'I_LANDET_FOR_GJENFORENING_ELLER_GIFTE_SEG',
    'ANDRE_FORELDER_MEDLEM_SISTE_5_ÅR',
    'ANDRE_FORELDER_MEDLEM_MINST_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR',
    'ANDRE_FORELDER_MEDLEM_MINST_7_ÅR_AVBRUDD_MER_ENN_10_ÅR',
    'TOTALVURDERING_OPPFYLLER_FORSKRIFT',
];

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
    OMSORG_FOR_EGNE_ELLER_ADOPTERTE_BARN: 'Søker brukeren stønad for egne/adopterte barn? ',
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
    ER_I_ARBEID_ELLER_FORBIGÅENDE_SYKDOM: 'Er brukeren i arbeid eller har forbigående sykdom?',
    INNTEKT_LAVERE_ENN_INNTEKTSGRENSE: 'Har brukeren inntekt under 6 ganger grunnbeløpet?',
    INNTEKT_SAMSVARER_MED_OS:
        'Er inntekten i samsvar med den inntekten som er lagt til grunn ved beregning av overgangsstønad?',
    HAR_ALDER_LAVERE_ENN_GRENSEVERDI: 'Har barnet fullført 4.skoleår?',
    UNNTAK_ALDER: 'Oppfylles unntak etter å ha fullført 4. skoleår?',
    HAR_DOKUMENTERTE_TILSYNSUTGIFTER: 'Har brukeren dokumenterte tilsynsutgifter?',
    RETT_TIL_OVERGANGSSTØNAD: 'Er vilkårene for rett til overgangsstønad oppfylt?',
    DOKUMENTASJON_AV_UTDANNING: 'Er det dokumentert at bruker er under utdanning?',
    DOKUMENTASJON_AV_UTGIFTER_UTDANNING:
        'Er det dokumentert at brukeren har utgifter til utdanningen?',
    NAVKONTOR_VURDERING: 'Har Nav-kontoret vurdert utdanningen?',
    SAKSBEHANDLER_VURDERING: 'Er utdanningen nødvendig og hensiktsmessig?',
};

export const svarTypeTilTekst: Record<string, string> = {
    JA: 'Ja',
    NEI: 'Nei',
    IKKE_OPPFYLT: 'Nei',
    IKKE_RELEVANT_IKKE_FØRSTEGANGSSØKNAD: 'Ikke relevant - ikke førstegangssøknad',
    ARBEID_NORSK_ARBEIDSGIVER: 'Arbeid for norsk arbeidsgiver',
    UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER: 'Utenlandsopphold på mindre enn 6 uker',
    OPPHOLDER_SEG_I_ANNET_EØS_LAND: 'Oppholder seg i annet EØS-land',
    GJENLEVENDE_OVERTAR_OMSORG:
        'Ja, gjenlevende har overtatt omsorgen for egne særkullsbarn etter dødsfallet',
    GJENLEVENDE_IKKE_RETT_TIL_YTELSER:
        'Ja, gjenlevende har fått barn etter dødsfallet som avdøde ikke er mor/far til',
    GJENLEVENDE_SEPARERT_FØR_DØDSFALL:
        'Ja, gjenlevende og den andre forelderen ble separert før dødsfallet',
    ANDRE_FORELDER_MEDLEM_MINST_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR:
        'Ja, medlem og bosatt når stønadstilfellet oppstod, den andre forelderen har vært medlem i minst 5 år etter fylte 16 år når krav fremsettes, og avbruddet er mindre enn 10 år',
    ANDRE_FORELDER_MEDLEM_MINST_7_ÅR_AVBRUDD_MER_ENN_10_ÅR:
        'Ja, medlem og bosatt når stønadstilfellet oppstod, den andre forelderen har vært medlem i minst 7 år etter fylte 16 år når krav fremsettes, og avbruddet er mer enn 10 år',
    ANDRE_FORELDER_MEDLEM_SISTE_5_ÅR:
        'Ja, medlem og bosatt når stønadstilfellet oppstod, den andre forelderen er bosatt og har vært medlem siste 5 år',
    I_LANDET_FOR_GJENFORENING_ELLER_GIFTE_SEG:
        'Ja, medlem og bosatt når stønadstilfellet oppstod, kom til landet for gjenforening med ektefelle/samboer med felles barn, eller for å gifte seg med en som er bosatt, og hadde gyldig oppholdstillatelse ved ankomst',
    MEDLEM_MER_ENN_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR:
        'Ja, medlem i minst 5 år etter fylte 16 år når krav fremsettes, og avbruddet er mindre enn 10 år',
    MEDLEM_MER_ENN_7_ÅR_AVBRUDD_MER_ENN_10ÅR:
        'Ja, medlem i minst 7 år etter fylte 16 år når krav fremsettes, og avbruddet er mer enn 10 år',
    TOTALVURDERING_OPPFYLLER_FORSKRIFT:
        'Ja, totalvurdering viser at forholdene går inn under forskriften om kravet om 5 års forutgående medlemskap',
    MEDLEM_MER_ENN_5_ÅR_EØS:
        'Ja, EØS-borger fyller vilkåret om 5 års forutgående medlemskap etter sammenlegging med medlemskapsperioder i annet EU/EØS-land',
    MEDLEM_MER_ENN_5_ÅR_EØS_ANNEN_FORELDER_TRYGDEDEKKET_I_NORGE:
        'Ja, EØS-borger fyller vilkåret om 5 års forutgående medlemskap etter bestemmelsene i annet EU/EØS-land, og den andre forelderen er EØS-borger og trygdedekket i Norge som yrkesaktiv',
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
    ER_I_ARBEID: 'Ja, det er dokumentert at brukeren er i arbeid',
    ETABLERER_EGEN_VIRKSOMHET: 'Ja, det er dokumentert at brukeren etablerer egen virksomhet',
    HAR_FORBIGÅENDE_SYKDOM: 'Ja, det er dokumentert at brukeren har forbigående sykdom',
    TRENGER_MER_TILSYN_ENN_JEVNALDRENDE:
        'Ja, barnet har fullført fjerde skoleår og det er dokumentert at barnet trenger vesentlig mer tilsyn enn jevnaldrende',
    FORSØRGER_HAR_LANGVARIG_ELLER_UREGELMESSIG_ARBEIDSTID:
        'Ja, barnet har fullført fjerde skoleår og det er dokumentert at forsørgeren har langvarig og/eller uregelmessig arbeidstid',
    NOEN_MÅNEDER_OVERSTIGER_6G: 'Ja, men noen måneder overstiger 6G',
    BRUKER_MOTTAR_IKKE_OVERGANGSSTØNAD: 'Bruker mottar ikke overgangsstønad',
};

/* Alternativer som kun er aktuelle for vedtak før 1. september 2023 skal kursiveres - for å vise saksbehandler at de
 *  er utdaterte. Alternativene må fortsatt være tilgjengelige å velge for potensielle saker man ikke får migrert fra infotrygd */
export const erUnntakForeldet = (tekst: string): boolean => eldreUnntaksregler.includes(tekst);
