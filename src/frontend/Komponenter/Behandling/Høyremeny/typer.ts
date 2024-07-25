import { Steg, StegUtfall } from './Steg';
import { Hendelse } from './Historikk';

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
    $siste: boolean;
    $størreMellomrom: boolean;
}
