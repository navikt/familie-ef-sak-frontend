import { Stønadstype } from './behandlingstema';
import { Behandlingstype } from './behandlingstype';
import { BehandlingStatus } from './behandlingstatus';
import { Steg } from '../../Komponenter/Behandling/Høyremeny/Steg';

export interface Fagsak {
    id: string;
    personIdent: string;
    stønadstype: Stønadstype;
    behandlinger: Behandling[];
    erLøpende: boolean;
}

export interface Behandling {
    id: string;
    type: Behandlingstype;
    steg: Steg;
    status: BehandlingStatus;
    sistEndret: string;
    endringerIRegistergrunnlag?: IEndringerRegistergrunnlag;
    opprettet: string;
    resultat: BehandlingResultat;
}

export interface IEndringerRegistergrunnlag {
    [key: string]: string[];
}

export enum BehandlingResultat {
    INNVILGET = 'INNVILGET',
    IKKE_SATT = 'IKKE_SATT',
    ANNULLERT = 'ANNULLERT', // TODO: Slettes
    HENLAGT = 'HENLAGT',
    AVSLÅTT = 'AVSLÅTT',
    OPPHØRT = 'OPPHØRT',
}

export const behandlingResultatTilTekst: Record<BehandlingResultat, string> = {
    INNVILGET: 'Innvilget',
    IKKE_SATT: 'Ikke satt',
    ANNULLERT: 'Annullert', // TODO: Slettes
    HENLAGT: 'Henlagt',
    OPPHØRT: 'Opphørt',
    AVSLÅTT: 'Avslått',
};
