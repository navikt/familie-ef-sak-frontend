import { Stønadstype } from './behandlingstema';
import { Behandlingstype } from './behandlingstype';
import { BehandlingStatus } from './behandlingstatus';
import { Steg } from '../../Komponenter/Behandling/Høyremeny/Steg';
import { Behandlingsårsak, EHenlagtårsak } from '../typer/Behandlingsårsak';
import { TilbakekrevingBehandlingsresultatstype } from './tilbakekreving';
import { KlagebehandlingResultat } from './klage';

export interface FagsakPersonMedBehandlinger {
    id: string;
    overgangsstønad?: Fagsak;
    barnetilsyn?: Fagsak;
    skolepenger?: Fagsak;
}

export interface Fagsak {
    id: string;
    eksternId: number;
    fagsakPersonId: string;
    personIdent: string;
    stønadstype: Stønadstype;
    behandlinger: Behandling[];
    erLøpende: boolean;
    erMigrert: boolean;
}

export interface Behandling {
    id: string;
    forrigeBehandlingId?: string;
    fagsakId: string;
    type: Behandlingstype;
    steg: Steg;
    status: BehandlingStatus;
    kategori: BehandlingKategori;
    sistEndret: string;
    opprettet: string;
    resultat: BehandlingResultat;
    behandlingsårsak: Behandlingsårsak;
    henlagtÅrsak?: EHenlagtårsak;
    stønadstype: Stønadstype;
    vedtaksdato?: string;
}

export enum BehandlingResultat {
    INNVILGET = 'INNVILGET',
    IKKE_SATT = 'IKKE_SATT',
    HENLAGT = 'HENLAGT',
    AVSLÅTT = 'AVSLÅTT',
    OPPHØRT = 'OPPHØRT',
}

export const behandlingResultatTilTekst: Record<
    BehandlingResultat | TilbakekrevingBehandlingsresultatstype | KlagebehandlingResultat,
    string
> = {
    INNVILGET: 'Innvilget',
    IKKE_SATT: 'Ikke satt',
    HENLAGT: 'Henlagt',
    OPPHØRT: 'Opphørt',
    AVSLÅTT: 'Avslått',
    IKKE_FASTSATT: 'Ikke fastsatt',
    INGEN_TILBAKEBETALING: 'Ingen tilbakebetaling',
    DELVIS_TILBAKEBETALING: 'Delvis tilbakebetaling',
    FULL_TILBAKEBETALING: 'Full tilbakebetaling',
    MEDHOLD: 'Medhold',
    IKKE_MEDHOLD: 'Oversendt til KA',
    IKKE_MEDHOLD_FORMKRAV_AVVIST: 'Ikke medhold, formkrav avvist',
};

export enum BehandlingKategori {
    EØS = 'EØS',
    NASJONAL = 'NASJONAL',
}

export const kategoriTilTekst: Record<BehandlingKategori, string> = {
    EØS: 'EØS',
    NASJONAL: 'Nasjonal',
};
