import { Stønadstype } from './behandlingstema';
import { Behandlingstype } from './behandlingstype';
import { BehandlingStatus } from './behandlingstatus';
import { Steg } from '../../Komponenter/Behandling/Høyremeny/Steg';

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
    resultat: BehandlingResultat;
}

export interface IEndringerRegistergrunnlag {
    [key: string]: string[];
}

enum BehandlingResultat {
    INNVILGET = 'INNVILGET',
    IKKE_SATT = 'IKKE_SATT',
    ANNULERT = 'ANNULERT',
    OPPHØRT = 'OPPHØRT',
}

export const behandlingResultatTilTekst: Record<BehandlingResultat, string> = {
    INNVILGET: 'Innvilget',
    IKKE_SATT: 'Ikke satt',
    ANNULERT: 'Annulert',
    OPPHØRT: 'Opphørt',
};
