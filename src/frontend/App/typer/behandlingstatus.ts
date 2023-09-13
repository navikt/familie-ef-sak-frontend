import { Behandling } from './fagsak';
import { ISaksbehandler } from './saksbehandler';
import { AnsvarligSaksbehandler } from '../hooks/useHentAnsvarligSaksbehandler';

export enum BehandlingStatus {
    OPPRETTET = 'OPPRETTET',
    UTREDES = 'UTREDES',
    FATTER_VEDTAK = 'FATTER_VEDTAK',
    IVERKSETTER_VEDTAK = 'IVERKSETTER_VEDTAK',
    FERDIGSTILT = 'FERDIGSTILT',
    SATT_PÅ_VENT = 'SATT_PÅ_VENT',
}

export const behandlingStatusTilTekst: Record<BehandlingStatus, string> = {
    OPPRETTET: 'Opprettet',
    UTREDES: 'Utredes',
    FATTER_VEDTAK: 'Fatter vedtak',
    IVERKSETTER_VEDTAK: 'Iverksetter vedtak',
    FERDIGSTILT: 'Ferdigstilt',
    SATT_PÅ_VENT: 'Satt på vent',
};

export const erBehandlingRedigerbar = (behandling: Behandling): boolean =>
    [BehandlingStatus.OPPRETTET, BehandlingStatus.UTREDES].includes(behandling.status);

export const erBehandlingUnderArbeid = (behandling: Behandling): boolean =>
    [BehandlingStatus.OPPRETTET, BehandlingStatus.UTREDES, BehandlingStatus.FATTER_VEDTAK].includes(
        behandling.status
    );

export const utredesEllerFatterVedtak = (behandling: Behandling): boolean =>
    [BehandlingStatus.UTREDES, BehandlingStatus.FATTER_VEDTAK].includes(behandling.status);

export const innloggetSaksbehandlerKanRedigereBehandling = (
    ansvarligSaksbehandler: AnsvarligSaksbehandler | null,
    innloggetSaksbehandler: ISaksbehandler
) => {
    return (
        !ansvarligSaksbehandler ||
        ansvarligSaksbehandler.navIdent === innloggetSaksbehandler.navIdent
    );
};

export enum ETaAvVentStatus {
    OK = 'OK',
    ANNEN_BEHANDLING_MÅ_FERDIGSTILLES = 'ANNEN_BEHANDLING_MÅ_FERDIGSTILLES',
    MÅ_NULSTILLE_VEDTAK = 'MÅ_NULSTILLE_VEDTAK',
}

export type TaAvVentStatus = {
    status: ETaAvVentStatus;
};
