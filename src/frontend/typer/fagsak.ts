import { Stønadstype } from './behandlingstema';
import { Behandlingstype } from './behandlingstype';
import { BehandlingStatus } from './behandlingstatus';

export interface Fagsak {
    id: string;
    personIdent: string;
    stønadstype: Stønadstype;
    behandlinger: BehandlingDto[];
}

export interface BehandlingDto {
    id: string;
    type: Behandlingstype;
    aktiv: boolean;
    status: BehandlingStatus;
    sistEndret: string;
}
