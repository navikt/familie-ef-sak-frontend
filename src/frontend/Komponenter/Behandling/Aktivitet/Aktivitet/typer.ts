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
    arbeidstaker = 'arbeidstaker',
    selvstendigNæringsdrivende = 'selvstendigNæringsdrivende',
    annenStønadNav = 'annenStønadNav',
    ingenInntekt = 'ingenInntekt',
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
    arbeidstaker: 'Arbeidstaker',
    selvstendigNæringsdrivende: 'Selvstendig næringsdrivende',
    annenStønadNav: 'Annen stønad fra NAV',
    ingenInntekt: 'Ingen inntekt',
};

export enum EErIArbeid {
    JA = 'JA',
    NeiFordiJegErSyk = 'NeiFordiJegErSyk',
}

export enum EDinSituasjon {
    erSyk = 'erSyk',
    harSyktBarn = 'harSyktBarn',
    harSøktBarnepassOgVenterEnnå = 'harSøktBarnepassOgVenterEnnå',
    harBarnMedSærligeBehov = 'harBarnMedSærligeBehov',
    barnSærligTilsyn = 'barnSærligTilsyn',
    barnUnder14Måneder = 'barnUnder14Måneder',
    barnSykdomIkkeVarig = 'barnSykdomIkkeVarig',
    ingenAvDisseGjelderMeg = 'ingenAvDisseGjelderMeg',
    nei = 'nei',
}

const tekstSærligTilsyn =
    'Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store sosiale problemer';

export const DinSituasjonTilTekst: Record<EDinSituasjon, string> = {
    erSyk: 'Jeg er syk',
    harSyktBarn: 'Barnet mitt er sykt',
    barnSykdomIkkeVarig: 'Barnet mitt har en sykdom som ikke er varig',
    harSøktBarnepassOgVenterEnnå: 'Jeg har søkt om barnepass, men ikke fått plass enda',
    barnSærligTilsyn: tekstSærligTilsyn,
    harBarnMedSærligeBehov: tekstSærligTilsyn,
    barnUnder14Måneder: 'Jeg har barn under 14 måneder',
    ingenAvDisseGjelderMeg: 'Ingen av disse gjelder meg',
    nei: 'Nei',
};

export enum Inntekter {
    arbeidstaker = 'arbeidstaker',
    selvstendigNæringsdrivende = 'selvstendigNæringsdrivende',
    annenStønadNav = 'annenStønadNav',
    nei = 'nei',
}

export const InntekterTilTekst: Record<Inntekter, string> = {
    arbeidstaker: 'Ja, jeg har inntekt som arbeidstaker',
    selvstendigNæringsdrivende: 'Ja, jeg har inntekt som selvstendig næringsdrivende',
    annenStønadNav: 'Ja, jeg får annen stønad fra Nav',
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

export enum EUtdanningsform {
    privat = 'privat',
    offentlig = 'offentlig',
}

export const UtdanningsformTilTekst: Record<EUtdanningsform, string> = {
    privat: 'Privat',
    offentlig: 'Offentlig',
};
