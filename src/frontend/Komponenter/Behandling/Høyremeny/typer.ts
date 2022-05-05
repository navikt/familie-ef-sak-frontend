import { Steg, StegUtfall } from './Steg';
import { Hendelse } from './Historikk';
import { Behandling } from '../../../App/typer/fagsak';

export interface Behandlingshistorikk {
    behandlingId: string;
    steg: Steg;
    hendelse: Hendelse;
    endretAvNavn: string;
    endretAvMail: string;
    endretTid: string;
    utfall?: StegUtfall;
    // eslint-disable-next-line
    metadata?: any;
}

export interface LinjeProps {
    siste: boolean;
    størreMellomrom: boolean;
}

export interface HistorikkElementProps {
    første: boolean;
    siste: boolean;
    behandlingshistorikk: Behandlingshistorikk;
    behandlingId: string;
    behandling: Behandling;
}

export interface StyledHistorikkElementProps {
    første: boolean;
}
