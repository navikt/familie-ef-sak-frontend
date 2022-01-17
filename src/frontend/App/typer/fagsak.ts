import { Stønadstype } from './behandlingstema';
import { Behandlingstype } from './behandlingstype';
import { BehandlingStatus } from './behandlingstatus';
import { Steg } from '../../Komponenter/Behandling/Høyremeny/Steg';
import { Behandlingsårsak } from '../typer/Behandlingsårsak';
import { TilbakekrevingBehandlingsresultatstype } from './tilbakekreving';

export interface Fagsak {
    id: string;
    eksternId: number;
    personIdent: string;
    stønadstype: Stønadstype;
    behandlinger: Behandling[];
    erLøpende: boolean;
    erMigrert: boolean;
}

export interface Behandling {
    id: string;
    fagsakId: string;
    type: Behandlingstype;
    steg: Steg;
    status: BehandlingStatus;
    sistEndret: string;
    endringerIRegistergrunnlag?: IEndringerRegistergrunnlag;
    opprettet: string;
    resultat: BehandlingResultat;
    behandlingsårsak: Behandlingsårsak;
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

export const behandlingResultatTilTekst: Record<BehandlingResultat, string> = {
    INNVILGET: 'Innvilget',
    IKKE_SATT: 'Ikke satt',
    HENLAGT: 'Henlagt',
    OPPHØRT: 'Opphørt',
    AVSLÅTT: 'Avslått',
};

export const tilbakekrevingBehandlingsresultattypeTilTekst: Record<
    TilbakekrevingBehandlingsresultatstype,
    string
> = {
    IKKE_FASTSATT: 'Ikke fastsatt',
    INGEN_TILBAKEBETALING: 'Ingen tilbakebetaling',
    DELVIS_TILBAKEBETALING: 'Delvis tilbakebetaling',
    FULL_TILBAKEBETALING: 'Full tilbakebetaling',
    HENLAGT: 'Henlagt',
};

export const BehandlingResultatInkludertTilbakekreving = {
    ...BehandlingResultat,
    ...TilbakekrevingBehandlingsresultatstype,
};

export const behandlingResultatInkludertTilbakekrevingTilTekst: Record<
    BehandlingResultat | TilbakekrevingBehandlingsresultatstype,
    string
> = { ...behandlingResultatTilTekst, ...tilbakekrevingBehandlingsresultattypeTilTekst };
