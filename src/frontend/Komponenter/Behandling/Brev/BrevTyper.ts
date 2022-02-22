import {
    initielleAvsnittTom,
    initielleAvsnittVarselOmAktivitetsplikt,
    initielleAvsnittVedtakAvslag,
    initielleAvsnittVedtakInvilgelse,
} from './BrevTyperTekst';
import { IMellomlagretBrevResponse } from '../../../App/hooks/useMellomlagringBrev';

export type ValgtFelt = { [valgFeltKategori: string]: Valgmulighet };
export type ValgteDelmaler = { [delmalNavn: string]: boolean };

export interface BrevStruktur {
    dokument: DokumentMal;
    flettefelter: AlleFlettefelter;
    htmlfelter?: BrevStrukturHtmlfelter;
}

export interface DokumentMal {
    delmalerSortert: Delmal[];
    dokumentHtmlfelter: Htmlfeltreferanse[];
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

interface BrevStrukturHtmlfelter {
    htmlfeltReferanse: Htmlfeltreferanse[];
}

export interface Flettefeltreferanse {
    _ref: string;
}

export interface Htmlfeltreferanse {
    felt: string;
}

export interface Htmlfelter {
    htmlfelter: Htmlfeltreferanse[];
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
    skalSkjulesIBrevbygger?: boolean;
}

export type AvsnittMedId = IAvsnitt & { id: string };

export interface IFritekstBrev {
    overskrift: string;
    avsnitt: IAvsnitt[];
    behandlingId?: string;
    brevType: FritekstBrevtype;
}

export interface IFrittståendeBrev {
    overskrift: string;
    avsnitt: IAvsnitt[];
    fagsakId: string;
    brevType: FrittståendeBrevtype;
}

export enum FrittståendeBrevtype {
    INFORMASJONSBREV = 'INFORMASJONSBREV',
    INNHENTING_AV_OPPLYSNINGER = 'INNHENTING_AV_OPPLYSNINGER',
    VARSEL_OM_AKTIVITETSPLIKT = 'VARSEL_OM_AKTIVITETSPLIKT',
}

export enum FritekstBrevtype {
    SANKSJON = 'SANKSJON',
    VEDTAK_INVILGELSE = 'VEDTAK_INVILGELSE',
    VEDTAK_AVSLAG = 'VEDTAK_AVSLAG',
}

export const BrevtyperTilOverskrift: Record<FrittståendeBrevtype | FritekstBrevtype, string> = {
    INFORMASJONSBREV: 'Vi vil informere deg om...',
    INNHENTING_AV_OPPLYSNINGER: 'Vi trenger mer informasjon fra deg',
    SANKSJON: 'Varsel om sanksjon',
    VARSEL_OM_AKTIVITETSPLIKT: 'Varsel om aktivitetsplikt',
    VEDTAK_INVILGELSE: 'Du får overgangsstønad',
    VEDTAK_AVSLAG: 'Vi har avslått søknaden din om overgangsstønad',
};

export const BrevtyperTilSelectNavn: Record<
    FrittståendeBrevtype | FritekstBrevtype | string,
    string
> = {
    INFORMASJONSBREV: 'Informasjonsbrev',
    INNHENTING_AV_OPPLYSNINGER: 'Innhenting av opplysninger',
    SANKSJON: 'Sanksjon',
    VARSEL_OM_AKTIVITETSPLIKT: 'Varsel om aktivitetsplikt',
    VEDTAK_INVILGELSE: 'Vedtak innvilgelse',
    VEDTAK_AVSLAG: 'Vedtak avslag',
};

export const BrevtyperTilAvsnitt: Record<FrittståendeBrevtype | FritekstBrevtype, AvsnittMedId[]> =
    {
        INFORMASJONSBREV: initielleAvsnittTom,
        INNHENTING_AV_OPPLYSNINGER: initielleAvsnittTom,
        SANKSJON: initielleAvsnittTom,
        VARSEL_OM_AKTIVITETSPLIKT: initielleAvsnittVarselOmAktivitetsplikt,
        VEDTAK_INVILGELSE: initielleAvsnittVedtakInvilgelse,
        VEDTAK_AVSLAG: initielleAvsnittVedtakAvslag,
    };

export enum FritekstBrevContext {
    FRITTSTÅENDE,
    BEHANDLING,
}

export interface IMellomlagretBrevFritekst {
    brev?: IFritekstBrev;
    brevType: FritekstBrevtype;
    brevtype: Brevtype.FRITEKSTBREV;
}

export type MellomlagerRespons = IMellomlagretBrevResponse | IMellomlagretBrevFritekst;

export enum Brevtype {
    SANITYBREV = 'SANITYBREV',
    FRITEKSTBREV = 'FRITEKSTBREV',
}
