import { Stønadstype } from './behandlingstema';
import { Behandlingstype } from './behandlingstype';
import { BehandlingStatus } from './behandlingstatus';
import { Steg } from '../komponenter/Høyremeny/Steg';

export interface Fagsak {
    id: string;
    personIdent: string;
    stønadstype: Stønadstype;
    behandlinger: Behandling[];
}

export interface Behandling {
    id: string;
    type: Behandlingstype;
    aktiv: boolean;
    steg: Steg;
    status: BehandlingStatus;
    sistEndret: string;
    endringerIRegistergrunnlag?: IEndringerRegistergrunnlag;
    opprettet: string;
    resultat: string;
}

export interface IEndringerRegistergrunnlag {
    [key: string]: string[];
}
