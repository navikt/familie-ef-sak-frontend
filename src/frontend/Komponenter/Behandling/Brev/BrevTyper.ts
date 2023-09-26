import { IMellomlagretBrevResponse } from '../../../App/hooks/useMellomlagringBrev';
import { IBrevmottakere } from '../Brevmottakere/typer';

export type ValgtFelt = { [valgFeltKategori: string]: Valgmulighet };
export type ValgteDelmaler = { [delmalNavn: string]: boolean };

export interface BrevStruktur {
    dokument: DokumentMal;
    flettefelter: AlleFlettefelter;
}

export type FritekstBlokk = {
    _type: 'fritekstområde';
    innhold: { id: string };
};
type DelmalBlokk = {
    _type: 'delmalBlock';
    innhold: Delmal;
};
export type BrevmenyBlokk = FritekstBlokk | DelmalBlokk;

export const erFritekstblokk = (blokk: BrevmenyBlokk): blokk is FritekstBlokk =>
    blokk._type === 'fritekstområde';

export const erDelmalBlokk = (blokk: BrevmenyBlokk): blokk is DelmalBlokk =>
    blokk._type === 'delmalBlock';

export type FritekstAvsnitt = {
    deloverskrift?: string;
    innhold: string;
};

export type Fritekstområder = {
    [id: string]: FritekstAvsnitt[];
};

export type DelmalGruppe = { type: 'DelmalGruppe'; gruppeVisningsnavn: string; delmaler: Delmal[] };
export type BrevmenyGruppe =
    | { type: 'fritekstområde'; fritekstområde: FritekstBlokk }
    | DelmalGruppe;
export const erDelmalGruppe = (e: BrevmenyGruppe): e is DelmalGruppe => e.type === 'DelmalGruppe';

export interface DokumentMal {
    delmalerSortert: Delmal[];
    brevmenyBlokker: BrevmenyBlokk[];
}

export interface AlleFlettefelter {
    flettefeltReferanse: Flettefelt[];
}
interface Flettefelt {
    felt: string;
    erFritektsfelt?: boolean;
    feltVisningsnavn?: string;
    _id: string;
    beskrivelse?: string;
}

export interface Flettefeltreferanse {
    _ref: string;
}

export interface FlettefeltMedVerdi extends Flettefeltreferanse {
    verdi: string | null;
    automatiskUtfylt?: boolean;
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
    valgfeltBeskrivelse?: string;
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
    prioriteringsnummer: number;
    overgangsstonad?: boolean;
    barnetilsyn?: boolean;
    skolepenger?: boolean;
    frittstaendeBrev?: { tittelDokumentoversikt: string };
}

export type FrittståendeSanitybrevDto = {
    pdf: string;
    mottakere: IBrevmottakere;
    tittel: string;
};

export type MellomlagerRespons = IMellomlagretBrevResponse;
export const datasett = 'ef-test'; // TODO endre til ef-brev
