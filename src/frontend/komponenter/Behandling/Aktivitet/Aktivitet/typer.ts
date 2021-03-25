export enum EArbeidssituasjon {
    erHjemmeMedBarnUnderEttÅr = 'erHjemmeMedBarnUnderEttÅr',
    erArbeidstakerOgEllerLønnsmottakerFrilanser = 'erArbeidstakerOgEllerLønnsmottakerFrilanser',
    erSelvstendigNæringsdriveneEllerFrilanser = 'erSelvstendigNæringsdriveneEllerFrilanser',
    erAnsattIEgetAS = 'erAnsattIEgetAS',
    etablererEgenVirksomhet = 'etablererEgenVirksomhet',
    erArbeidssøker = 'erArbeidssøker',
    tarUtdanning = 'tarUtdanning',
    harFåttJobbTilbud = 'harFåttJobbTilbud',
    erHverkenIArbeidUtdanningEllerArbeidssøker = 'erHverkenIArbeidUtdanningEllerArbeidssøker',
}
export const ArbeidssituasjonTilTekst: Record<EArbeidssituasjon, string> = {
    erHjemmeMedBarnUnderEttÅr: 'Hjemme med barn under 1 år',
    erArbeidstakerOgEllerLønnsmottakerFrilanser: 'Arbeidstaker / Lønnsmottaker som frilanser',
    erSelvstendigNæringsdriveneEllerFrilanser:
        'Selvstendig næringsdrivende eller frilanser med enkeltpersonforetak',
    erAnsattIEgetAS: 'Ansatt i eget aksjeselskap (AS)',
    etablererEgenVirksomhet: 'Etablerer egen virksomhet',
    erArbeidssøker: 'Arbeidssøker',
    tarUtdanning: 'Tar eller skal ta utdanning',
    harFåttJobbTilbud: 'Har fått jobbtilbud',
    erHverkenIArbeidUtdanningEllerArbeidssøker: 'Ikke i arbeid, utdanning eller arbeidssøker',
};

export enum EDinSituasjon {
    erSyk = 'erSyk',
    harSyktBarn = 'harSyktBarn',
    harSøktBarnepassOgVenterEnnå = 'harSøktBarnepassOgVenterEnnå',
    harBarnMedSærligeBehov = 'harBarnMedSærligeBehov',
    nei = 'nei',
}

export const DinSituasjonTilTekst: Record<EDinSituasjon, string> = {
    erSyk: 'Jeg er syk',
    harSyktBarn: 'Barnet mitt er sykt',
    harSøktBarnepassOgVenterEnnå: 'Jeg har søkt om barnepass, men ikke fått plass enda',
    harBarnMedSærligeBehov:
        'Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store sosiale problemer',
    nei: 'Nei',
};

export enum EStilling {
    fast = 'fast',
    midlertidig = 'midlertidig',
    lærling = 'lærling',
    tilkallingsvakt = 'tilkallingsvakt',
}

export const StillingTilTekst: Record<EStilling, string> = {
    fast: 'Fast stilling',
    midlertidig: 'Midlertidig stilling',
    lærling: 'Lærling',
    tilkallingsvakt: 'Tilkallingsvikar eller liknende',
};

export enum EStudieandel {
    heltid = 'heltid',
    deltid = 'deltid',
}
export const StudieandelTilTekst: Record<EStudieandel, string> = {
    heltid: 'Heltid',
    deltid: 'Deltid',
};
