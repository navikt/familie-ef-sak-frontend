import { Stønadstype } from './behandlingstema';
import { Behandlingstype } from './behandlingstype';
import { BehandlingStatus } from './behandlingstatus';
import { Steg } from '../../Komponenter/Behandling/Høyremeny/Steg';
import { Behandlingsårsak, EHenlagtårsak } from '../typer/Behandlingsårsak';
import { TilbakekrevingBehandlingsresultatstype } from './tilbakekreving';
import { KlagebehandlingResultat } from './klage';

export interface IFagsakPerson {
    id: string;
    overgangsstønad?: string;
    barnetilsyn?: string;
    skolepenger?: string;
}

export interface IFagsakPersonMedBehandlinger {
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
    sistEndret: string;
    endringerIRegistergrunnlag?: IEndringerRegistergrunnlag;
    opprettet: string;
    resultat: BehandlingResultat;
    behandlingsårsak: Behandlingsårsak;
    henlagtÅrsak?: EHenlagtårsak;
    stønadstype: Stønadstype;
    vedtaksdato?: string;
}

export interface IEndringerRegistergrunnlag {
    [key: string]: string[];
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
    IKKE_MEDHOLD: 'Ikke medhold',
};
