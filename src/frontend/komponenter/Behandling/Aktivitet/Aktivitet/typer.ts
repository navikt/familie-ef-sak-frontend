export enum EArbeidssituasjon {
    erHjemmeMedBarnUnderEttÅr = 'erHjemmeMedBarnUnderEttÅr',
    erArbeidstaker = 'erArbeidstaker',
    erFrilanser = 'erFrilanser',
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
    erArbeidstaker: 'Arbeidstaker',
    erFrilanser: 'Lønnsmottaker som frilanser',
    erSelvstendigNæringsdriveneEllerFrilanser:
        'Selvstendig næringsdrivende eller frilanser med enkeltpersonforetak',
    erAnsattIEgetAS: 'Ansatt i eget aksjeselskap (AS)',
    etablererEgenVirksomhet: 'Etablerer egen virksomhet',
    erArbeidssøker: 'Arbeidssøker',
    tarUtdanning: 'Tar eller skal ta utdanning',
    harFåttJobbTilbud: 'Har fått jobbtilbud',
    erHverkenIArbeidUtdanningEllerArbeidssøker: 'Ikke i arbeid, utdanning eller arbeidssøker',
};
