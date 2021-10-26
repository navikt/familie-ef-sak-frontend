export type ValgtFelt = { [valgFeltKategori: string]: Valgmulighet };
export type ValgteDelmaler = { [delmalNavn: string]: boolean };

export interface BrevStruktur {
    dokument: DokumentMal;
    flettefelter: AlleFlettefelter;
}
export interface DokumentMal {
    delmalerSortert: Delmal[];
}

export interface AlleFlettefelter {
    flettefeltReferanse: Flettefelt[];
}
interface Flettefelt {
    felt: string;
    erFritektsfelt?: boolean;
    feltVisningsnavn?: string;
    _id: string;
}

export interface Flettefeltreferanse {
    _ref: string;
}

export interface FlettefeltMedVerdi extends Flettefeltreferanse {
    verdi: string | null;
}

export interface Valgmulighet {
    flettefelter: Flettefelter[];
    valgmulighet: string;
    visningsnavnValgmulighet: string;
}

export interface Flettefelter {
    flettefelt: Flettefeltreferanse[];
}
export interface ValgFelt {
    valgMuligheter: Valgmulighet[];
    valgfeltVisningsnavn: string;
    valgFeltApiNavn: string;
}

export interface Delmal {
    delmalApiNavn: string;
    delmalNavn: string;
    delmalValgfelt: ValgFelt[];
    delmalFlettefelter: Flettefelter[]; // referanse til flettefelt
    gruppeVisningsnavn: string;
}

export interface DokumentNavn {
    apiNavn: string;
    visningsnavn: string;
}

export interface IAvsnitt {
    deloverskrift: string;
    innhold: string;
    id: string;
}

export interface IFritekstBrev {
    overskrift: string;
    avsnitt: IAvsnitt[];
    fagsakId?: string;
    behandlingId?: string;
}

export interface IFrittståendeBrev {
    overskrift: string;
    avsnitt: IAvsnitt[];
    fagsakId: string;
    stønadType: string;
    brevType: string;
}

export enum FrittståendeBrevtype {
    INFORMASJONSBREV = 'INFORMASJONSBREV',
    INNHENTING_AV_OPPLYSNINGER = 'INNHENTING_AV_OPPLYSNINGER',
    VARSEL_OM_AKTIVITETSPLIKT = 'VARSEL_OM_AKTIVITETSPLIKT',
}

export enum FritekstBrevtype {
    VEDTAK_INVILGELSE = 'VEDTAK_INVILGELSE',
    VEDTAK_AVSLAG = 'VEDTAK_AVSLAG',
}

export const BrevtyperTilOverskrift: Record<FrittståendeBrevtype | FritekstBrevtype, string> = {
    INFORMASJONSBREV: 'Vi vil informere deg om...',
    INNHENTING_AV_OPPLYSNINGER: 'Vi trenger mer informasjon av deg',
    VARSEL_OM_AKTIVITETSPLIKT: 'Varsel om aktivitetsplikt',
    VEDTAK_INVILGELSE: 'Du får overgangsstønad',
    VEDTAK_AVSLAG: 'Vi har avslått søknaden din om overgangsstønad',
};

export const BrevtyperTilSelectNavn: Record<FrittståendeBrevtype | FritekstBrevtype, string> = {
    INFORMASJONSBREV: 'Informasjonsbrev',
    INNHENTING_AV_OPPLYSNINGER: 'Innhenting av opplysninger',
    VARSEL_OM_AKTIVITETSPLIKT: 'Varsel om aktivitetsplikt',
    VEDTAK_INVILGELSE: 'Vedtak innvilgelse',
    VEDTAK_AVSLAG: 'Vedtak avslag',
};

export const BrevtyperTilDeloverskriftTekst: Record<
    FrittståendeBrevtype | FritekstBrevtype,
    string
> = {
    INFORMASJONSBREV: '',
    INNHENTING_AV_OPPLYSNINGER: '',
    VARSEL_OM_AKTIVITETSPLIKT: 'Dette er en deloverskrift til varsel om aktivitetsplikt', // TODO: tekst
    VEDTAK_INVILGELSE: '',
    VEDTAK_AVSLAG: '',
};

export const BrevtyperTilInnholdTekst: Record<FrittståendeBrevtype | FritekstBrevtype, string> = {
    INFORMASJONSBREV: '',
    INNHENTING_AV_OPPLYSNINGER: '',
    VARSEL_OM_AKTIVITETSPLIKT: 'Her skal det komme tekst etterhvert', // TODO: tekst
    VEDTAK_INVILGELSE:
        'Du må si ifra om endringer\n' +
        'Hvis det skjer endringer som kan ha betydning for stønaden din, må du si ifra til oss. Du finner oversikten over endringer du må si ifra om på nav.no/familie/alene¿med¿barn/overgangsstonad#melde. Du sier ifra om endringer ved å skrive en beskjed til oss på nav.no/person/kontakt¿oss/nb/skriv¿til¿oss.\n' +
        '\n' +
        'Slik beregner vi inntekten din\n' +
        'Du kan lese mer om hvordan vi beregner inntekten din på nav.no/overgangsstonad¿enslig#hvor¿mye.\n' +
        '\n' +
        'Du har rett til å klage\n' +
        'Hvis du vil klage, må du gjøre dette innen 6 uker fra den datoen du fikk dette brevet. Du finner skjema og informasjon på nav.no/klage.\n' +
        '\n' +
        'Du har rett til innsyn\n' +
        'På nav.no/dittnav kan du se dokumentene i saken din.\n' +
        '\n' +
        'Har du spørsmål?\n' +
        'Du finner informasjon som kan være nyttig for deg på nav.no/familie. Du kan også kontakte oss på nav.no/kontakt.',
    VEDTAK_AVSLAG:
        'Du har rett til å klage\n' +
        'Hvis du vil klage, må du gjøre dette innen 6 uker fra den datoen du fikk dette brevet. Du finner skjema og informasjon på nav.no/klage.\n' +
        '\n' +
        'Du har rett til innsyn\n' +
        'På nav.no/dittnav kan du se dokumentene i saken din.\n' +
        '\n' +
        'Har du spørsmål?\n' +
        'Du finner nyttig informasjon på nav.no/overgangsstonad-enslig. Du kan også kontakte oss på nav.no/kontakt.\n' +
        '\n' +
        'Med vennlig hilsen\n' +
        'NAV Arbeid og ytelser [geografisk enhet]\n' +
        '[Saksbehandler] - [Beslutter]',
};

export enum FritekstBrevContext {
    FRITTSTÅENDE,
    BEHANDLING,
}
