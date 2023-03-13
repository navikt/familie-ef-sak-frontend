import {
    initielleAvsnittTom,
    initielleAvsnittVarselOmAktivitetsplikt,
    initielleAvsnittVedtakAvslagOvergangsstønad,
    initielleAvsnittVedtakAvslagBarnetilsyn,
    initielleAvsnittVedtakInvilgelse,
    initielleAvsnittVedtakInvilgelseBarnetilsyn,
    initielleAvsnittInnhentingAvKarakterutskriftHovedperiode,
    initielleAvsnittInnhentingAvKarakterutskriftUtvidetPeriode,
    initielleAvsnittVedtakInvilgelseSkolepenger,
    initielleAvsnittVedtakAvslagSkolepenger,
    initielleAvsnittInnhentingAvOpplysninger,
    initielleAvsnittVedtakOpphørBarnetilsyn,
    initielleAvsnittVedtakOpphørSkolepenger,
    initielleAvsnittSvartidKlage,
    initielleAvsnittForlengetSvartidKlage,
    initielleAvsnittForlengetSvartid,
    initielleAvsnittTrukketSøknad,
    initielleAvsnittVarselUtestengelse,
    initielleAvsnittVedtaklUtestengelse,
} from './BrevTyperTekst';
import { IMellomlagretBrevResponse } from '../../../App/hooks/useMellomlagringBrev';
import { Stønadstype } from '../../../App/typer/behandlingstema';
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
    overgangsstonad?: boolean;
    barnetilsyn?: boolean;
    skolepenger?: boolean;
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
    mottakere?: IBrevmottakere;
}

export enum FrittståendeBrevtype {
    INFORMASJONSBREV = 'INFORMASJONSBREV',
    INNHENTING_AV_OPPLYSNINGER = 'INNHENTING_AV_OPPLYSNINGER',
    VARSEL_OM_AKTIVITETSPLIKT = 'VARSEL_OM_AKTIVITETSPLIKT',
    VARSEL_OM_SANKSJON = 'VARSEL_OM_SANKSJON',
    INNHENTING_AV_KARAKTERUTSKRIFT_HOVEDPERIODE = 'INNHENTING_AV_KARAKTERUTSKRIFT_HOVEDPERIODE',
    INNHENTING_AV_KARAKTERUTSKRIFT_UTVIDET_PERIODE = 'INNHENTING_AV_KARAKTERUTSKRIFT_UTVIDET_PERIODE',
    BREV_OM_SVARTID_KLAGE = 'BREV_OM_SVARTID_KLAGE',
    BREV_OM_FORLENGET_SVARTID = 'BREV_OM_FORLENGET_SVARTID',
    BREV_OM_FORLENGET_SVARTID_KLAGE = 'BREV_OM_FORLENGET_SVARTID_KLAGE',
    INFORMASJONSBREV_TRUKKET_SØKNAD = 'INFORMASJONSBREV_TRUKKET_SØKNAD',
    VARSEL_UTESTENGELSE = 'VARSEL_UTESTENGELSE',
    VEDTAK_UTESTENGELSE = 'VEDTAK_UTESTENGELSE',
}

export enum FritekstBrevtype {
    SANKSJON = 'SANKSJON',
    VEDTAK_INVILGELSE = 'VEDTAK_INVILGELSE',
    VEDTAK_AVSLAG = 'VEDTAK_AVSLAG',
    VEDTAK_OPPHØR = 'VEDTAK_OPPHØR',
    VEDTAK_REVURDERING = 'VEDTAK_REVURDERING',
    VEDTAK_INNVILGELSE_BARNETILSYN = 'VEDTAK_INNVILGELSE_BARNETILSYN',
    VEDTAK_AVSLAG_BARNETILSYN = 'VEDTAK_AVSLAG_BARNETILSYN',
    VEDTAK_INNVILGELSE_SKOLEPENGER = 'VEDTAK_INNVILGELSE_SKOLEPENGER',
    VEDTAK_AVSLAG_SKOLEPENGER = 'VEDTAK_AVSLAG_SKOLEPENGER',
    VEDTAK_OPPHØR_BARNETILSYN = 'VEDTAK_OPPHØR_BARNETILSYN',
    VEDTAK_OPPHØR_SKOLEPENGER = 'VEDTAK_OPPHØR_SKOLEPENGER',
    VEDTAK_UTESTENGELSE = 'VEDTAK_UTESTENGELSE',
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
    INNHENTING_AV_KARAKTERUTSKRIFT_HOVEDPERIODE: 'Vi trenger opplysninger fra deg',
    INNHENTING_AV_KARAKTERUTSKRIFT_UTVIDET_PERIODE: 'Vi trenger opplysninger fra deg',
    VEDTAK_INNVILGELSE_SKOLEPENGER: 'Du får stønad til skolepenger',
    VEDTAK_AVSLAG_SKOLEPENGER: 'Vi har avslått søknaden din om stønad til skolepenger',
    VEDTAK_OPPHØR_BARNETILSYN: 'Vi har stanset stønaden din til barnetilsyn',
    VEDTAK_OPPHØR_SKOLEPENGER: 'Vi har stanset stønaden din til skolepenger',
    BREV_OM_SVARTID_KLAGE: 'Vi har fått klagen din',
    BREV_OM_FORLENGET_SVARTID: 'Saksbehandlingen vil ta lenger tid',
    BREV_OM_FORLENGET_SVARTID_KLAGE: 'Saksbehandlingen vil ta lenger tid',
    INFORMASJONSBREV_TRUKKET_SØKNAD: 'Saken din om [stønad] er avsluttet',
    VARSEL_UTESTENGELSE:
        'Vi vurderer å ta fra deg retten til stønad til enslig mor eller far i en periode',
    VEDTAK_UTESTENGELSE:
        'Vi har tatt fra deg retten til stønad til enslig mor eller far i en periode',
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
    VEDTAK_INNVILGELSE_SKOLEPENGER: 'Vedtak innvilgelse',
    VEDTAK_AVSLAG_SKOLEPENGER: 'Vedtak avslag',
    VEDTAK_OPPHØR_BARNETILSYN: 'Vedtak opphør',
    VEDTAK_OPPHØR_SKOLEPENGER: 'Vedtak opphør',
    BREV_OM_SVARTID_KLAGE: 'Brev om svartid - klage',
    BREV_OM_FORLENGET_SVARTID: 'Brev om forlenget svartid',
    BREV_OM_FORLENGET_SVARTID_KLAGE: 'Brev om forlenget svartid - klage',
    INFORMASJONSBREV_TRUKKET_SØKNAD: 'Informasjonsbrev - bruker har trukket søknad',
    VARSEL_UTESTENGELSE: 'Varsel om utestengelse',
    VEDTAK_UTESTENGELSE: 'Vedtak om utestengelse',
};

export const stønadstypeTilBrevtyper: Record<Stønadstype, FritekstBrevtype[]> = {
    OVERGANGSSTØNAD: [
        FritekstBrevtype.SANKSJON,
        FritekstBrevtype.VEDTAK_INVILGELSE,
        FritekstBrevtype.VEDTAK_AVSLAG,
        FritekstBrevtype.VEDTAK_OPPHØR,
        FritekstBrevtype.VEDTAK_REVURDERING,
        FritekstBrevtype.VEDTAK_UTESTENGELSE,
    ],
    BARNETILSYN: [
        FritekstBrevtype.VEDTAK_INNVILGELSE_BARNETILSYN,
        FritekstBrevtype.VEDTAK_AVSLAG_BARNETILSYN,
        FritekstBrevtype.VEDTAK_OPPHØR_BARNETILSYN,
        FritekstBrevtype.VEDTAK_UTESTENGELSE,
    ],
    SKOLEPENGER: [
        FritekstBrevtype.VEDTAK_INNVILGELSE_SKOLEPENGER,
        FritekstBrevtype.VEDTAK_AVSLAG_SKOLEPENGER,
        FritekstBrevtype.VEDTAK_OPPHØR_SKOLEPENGER,
        FritekstBrevtype.VEDTAK_UTESTENGELSE,
    ],
};

export const BrevtyperTilAvsnitt: Record<FrittståendeBrevtype | FritekstBrevtype, AvsnittMedId[]> =
    {
        INFORMASJONSBREV: initielleAvsnittTom,
        INNHENTING_AV_OPPLYSNINGER: initielleAvsnittInnhentingAvOpplysninger,
        SANKSJON: initielleAvsnittTom,
        VARSEL_OM_AKTIVITETSPLIKT: initielleAvsnittVarselOmAktivitetsplikt,
        VARSEL_OM_SANKSJON: initielleAvsnittTom,
        VEDTAK_INVILGELSE: initielleAvsnittVedtakInvilgelse,
        VEDTAK_AVSLAG: initielleAvsnittVedtakAvslagOvergangsstønad,
        VEDTAK_OPPHØR: initielleAvsnittVedtakAvslagOvergangsstønad,
        VEDTAK_REVURDERING: initielleAvsnittVedtakInvilgelse,
        VEDTAK_INNVILGELSE_BARNETILSYN: initielleAvsnittVedtakInvilgelseBarnetilsyn,
        VEDTAK_AVSLAG_BARNETILSYN: initielleAvsnittVedtakAvslagBarnetilsyn,
        INNHENTING_AV_KARAKTERUTSKRIFT_HOVEDPERIODE:
            initielleAvsnittInnhentingAvKarakterutskriftHovedperiode,
        INNHENTING_AV_KARAKTERUTSKRIFT_UTVIDET_PERIODE:
            initielleAvsnittInnhentingAvKarakterutskriftUtvidetPeriode,
        VEDTAK_INNVILGELSE_SKOLEPENGER: initielleAvsnittVedtakInvilgelseSkolepenger,
        VEDTAK_AVSLAG_SKOLEPENGER: initielleAvsnittVedtakAvslagSkolepenger,
        VEDTAK_OPPHØR_BARNETILSYN: initielleAvsnittVedtakOpphørBarnetilsyn,
        VEDTAK_OPPHØR_SKOLEPENGER: initielleAvsnittVedtakOpphørSkolepenger,
        BREV_OM_SVARTID_KLAGE: initielleAvsnittSvartidKlage,
        BREV_OM_FORLENGET_SVARTID: initielleAvsnittForlengetSvartid,
        BREV_OM_FORLENGET_SVARTID_KLAGE: initielleAvsnittForlengetSvartidKlage,
        INFORMASJONSBREV_TRUKKET_SØKNAD: initielleAvsnittTrukketSøknad,
        VARSEL_UTESTENGELSE: initielleAvsnittVarselUtestengelse,
        VEDTAK_UTESTENGELSE: initielleAvsnittVedtaklUtestengelse,
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
