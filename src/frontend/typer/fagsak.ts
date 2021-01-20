import { Stønadstype } from './behandlingstema';
import { Behandlingstype } from './behandlingstype';
import { BehandlingStatus } from './behandlingstatus';

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
}

export const enum Steg {
    REGISTRERE_OPPLYSNINGER = 'REGISTRERE_OPPLYSNINGER',
    VILKÅRSVURDERE_INNGANGSVILKÅR = 'VILKÅRSVURDERE_INNGANGSVILKÅR',
    VILKÅRSVURDERE_STØNAD = 'VILKÅRSVURDERE_STØNAD',
    BEREGNE_YTELSE = 'BEREGNE_YTELSE',
    SEND_TIL_BESLUTTER = 'SEND_TIL_BESLUTTER',
    BESLUTTE_VEDTAK = 'BESLUTTE_VEDTAK',
    IVERKSETT_MOT_OPPDRAG = 'IVERKSETT_MOT_OPPDRAG',
    VENTE_PÅ_STATUS_FRA_ØKONOMI = 'VENTE_PÅ_STATUS_FRA_ØKONOMI',
    JOURNALFØR_VEDTAKSBREV = 'JOURNALFØR_VEDTAKSBREV',
    DISTRIBUER_VEDTAKSBREV = 'DISTRIBUER_VEDTAKSBREV',
    FERDIGSTILLE_BEHANDLING = 'FERDIGSTILLE_BEHANDLING',
    BEHANDLING_FERDIGSTILT = 'BEHANDLING_FERDIGSTILT',
}
