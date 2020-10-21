import { Stønadstype } from './behandlingstema';
import { BehandlingType } from './behandlingtype';
import { BehandlingStatus } from './behandlingstatus';

export interface Fagsak {
    id: string;
    personIdent: string;
    stønadstype: Stønadstype;
    behandlinger: BehandlingDto[];
}

export interface BehandlingDto {
    id: string;
    type: BehandlingType;
    aktiv: boolean;
    status: BehandlingStatus;
    sistEndret: string;
}
