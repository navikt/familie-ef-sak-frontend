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

export enum FrittståendeBrevType {
    INFORMASJONSBREV = 'INFORMASJONSBREV',
    INNHENTING_AV_OPPLYSNINGER = 'INNHENTING_AV_OPPLYSNINGER',
}

export enum FrittståendeBrevStønadType {
    OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
    BARNETILSYN = 'BARNETILSYN',
    SKOLEPENGER = 'SKOLEPENGER',
}

export enum FrittståendeBrevStønadOgBrevType {
    MANGELBREV_OVERGANGSSTØNAD = 'MANGELBREV_OVERGANGSSTØNAD',
    MANGELBREV_BARNETILSYN = 'MANGELBREV_BARNETILSYN',
    MANGELBREV_SKOLEPENGER = 'MANGELBREV_SKOLEPENGER',
    INFOBREV_OVERGANGSSTØNAD = 'INFOBREV_OVERGANGSSTØNAD',
    INFOBREV_BARNETILSYN = 'INFOBREV_BARNETILSYN',
    INFOBREV_SKOLEPENGER = 'INFOBREV_SKOLEPENGER',
}

export const BrevtypeTilForhåndstekst: Record<FrittståendeBrevType, string> = {
    INFORMASJONSBREV: 'Vi vil informere deg om...',
    INNHENTING_AV_OPPLYSNINGER: 'Vi trenger mer informasjon fra deg',
};
