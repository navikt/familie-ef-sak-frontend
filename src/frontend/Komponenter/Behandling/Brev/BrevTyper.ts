import {
    initielleAvsnittTom,
    initielleAvsnittVarselOmAktivitetsplikt,
    initielleAvsnittVedtakAvslag,
    initielleAvsnittVedtakAvslagBarnetilsyn,
    initielleAvsnittVedtakInvilgelse,
    initielleAvsnittVedtakInvilgelseBarnetilsyn,
    initielleAvsnittInnhentingAvKarakterutskriftHovedperiode,
    initielleAvsnittInnhentingAvKarakterutskriftUtvidetPeriode,
} from './BrevTyperTekst';
import { IMellomlagretBrevResponse } from '../../../App/hooks/useMellomlagringBrev';
import { Stønadstype } from '../../../App/typer/behandlingstema';

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
    VARSEL_OM_SANKSJON = 'VARSEL_OM_SANKSJON',
    INNHENTING_AV_KARAKTERUTSKRIFT_HOVEDPERIODE = 'INNHENTING_AV_KARAKTERUTSKRIFT_HOVEDPERIODE',
    INNHENTING_AV_KARAKTERUTSKRIFT_UTVIDET_PERIODE = 'INNHENTING_AV_KARAKTERUTSKRIFT_UTVIDET_PERIODE',
}

export enum FritekstBrevtype {
    SANKSJON = 'SANKSJON',
    VEDTAK_INVILGELSE = 'VEDTAK_INVILGELSE',
    VEDTAK_AVSLAG = 'VEDTAK_AVSLAG',
    VEDTAK_OPPHØR = 'VEDTAK_OPPHØR',
    VEDTAK_REVURDERING = 'VEDTAK_REVURDERING',
    VEDTAK_INNVILGELSE_BARNETILSYN = 'VEDTAK_INNVILGELSE_BARNETILSYN',
    VEDTAK_AVSLAG_BARNETILSYN = 'VEDTAK_AVSLAG_BARNETILSYN',
}

export const BrevtyperTilOverskrift: Record<FrittståendeBrevtype | FritekstBrevtype, string> = {
    INFORMASJONSBREV: 'Vi vil informere deg om...',
    INNHENTING_AV_OPPLYSNINGER: 'Vi trenger mer informasjon fra deg',
    SANKSJON: 'Vedtak om sanksjon',
    VARSEL_OM_AKTIVITETSPLIKT: 'Varsel om aktivitetsplikt',
    VARSEL_OM_SANKSJON: 'Varsel om sanksjon',
    VEDTAK_INVILGELSE: 'Du får overgangsstønad',
    VEDTAK_AVSLAG: 'Vi har avslått søknaden din om overgangsstønad',
    VEDTAK_OPPHØR: 'Vi har stanset overgangsstønaden din',
    VEDTAK_REVURDERING: 'Vi har vurdert overgangsstønaden din på nytt',
    VEDTAK_INNVILGELSE_BARNETILSYN: 'Du får stønad til barnetilsyn',
    VEDTAK_AVSLAG_BARNETILSYN: 'Vi har avslått søknaden din om stønad til barnetilsyn',
    INNHENTING_AV_KARAKTERUTSKRIFT_HOVEDPERIODE: 'Vi trenger opplysninger om deg',
    INNHENTING_AV_KARAKTERUTSKRIFT_UTVIDET_PERIODE: 'Vi trenger opplysninger om deg',
};

export const BrevtyperTilSelectNavn: Record<
    FrittståendeBrevtype | FritekstBrevtype | string,
    string
> = {
    INFORMASJONSBREV: 'Informasjonsbrev',
    INNHENTING_AV_OPPLYSNINGER: 'Innhenting av opplysninger',
    SANKSJON: 'Vedtak om sanksjon',
    VARSEL_OM_AKTIVITETSPLIKT: 'Varsel om aktivitetsplikt',
    VARSEL_OM_SANKSJON: 'Varsel om sanksjon',
    VEDTAK_INVILGELSE: 'Vedtak innvilgelse',
    VEDTAK_AVSLAG: 'Vedtak avslag',
    VEDTAK_OPPHØR: 'Vedtak opphør',
    VEDTAK_REVURDERING: 'Vedtak revurdering',
    VEDTAK_INNVILGELSE_BARNETILSYN: 'Vedtak innvilgelse',
    VEDTAK_AVSLAG_BARNETILSYN: 'Vedtak avslag',
    INNHENTING_AV_KARAKTERUTSKRIFT_HOVEDPERIODE: 'Innhenting av karakterutskrift (hovedperiode)',
    INNHENTING_AV_KARAKTERUTSKRIFT_UTVIDET_PERIODE:
        'Innhenting av karakterutskrift (utvidet periode)',
};

export const stønadstypeTilBrevtyper: Record<Stønadstype, FritekstBrevtype[]> = {
    OVERGANGSSTØNAD: [
        FritekstBrevtype.SANKSJON,
        FritekstBrevtype.VEDTAK_INVILGELSE,
        FritekstBrevtype.VEDTAK_AVSLAG,
        FritekstBrevtype.VEDTAK_OPPHØR,
        FritekstBrevtype.VEDTAK_REVURDERING,
    ],
    BARNETILSYN: [
        FritekstBrevtype.VEDTAK_INNVILGELSE_BARNETILSYN,
        FritekstBrevtype.VEDTAK_AVSLAG_BARNETILSYN,
    ],
    SKOLEPENGER: [],
};

export const BrevtyperTilAvsnitt: Record<FrittståendeBrevtype | FritekstBrevtype, AvsnittMedId[]> =
    {
        INFORMASJONSBREV: initielleAvsnittTom,
        INNHENTING_AV_OPPLYSNINGER: initielleAvsnittTom,
        SANKSJON: initielleAvsnittTom,
        VARSEL_OM_AKTIVITETSPLIKT: initielleAvsnittVarselOmAktivitetsplikt,
        VARSEL_OM_SANKSJON: initielleAvsnittTom,
        VEDTAK_INVILGELSE: initielleAvsnittVedtakInvilgelse,
        VEDTAK_AVSLAG: initielleAvsnittVedtakAvslag,
        VEDTAK_OPPHØR: initielleAvsnittVedtakAvslag,
        VEDTAK_REVURDERING: initielleAvsnittVedtakInvilgelse,
        VEDTAK_INNVILGELSE_BARNETILSYN: initielleAvsnittVedtakInvilgelseBarnetilsyn,
        VEDTAK_AVSLAG_BARNETILSYN: initielleAvsnittVedtakAvslagBarnetilsyn,
        INNHENTING_AV_KARAKTERUTSKRIFT_HOVEDPERIODE:
            initielleAvsnittInnhentingAvKarakterutskriftHovedperiode,
        INNHENTING_AV_KARAKTERUTSKRIFT_UTVIDET_PERIODE:
            initielleAvsnittInnhentingAvKarakterutskriftUtvidetPeriode,
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
