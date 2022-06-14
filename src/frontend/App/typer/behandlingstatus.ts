import { Behandling } from './fagsak';

export enum BehandlingStatus {
    OPPRETTET = 'OPPRETTET',
    UTREDES = 'UTREDES',
    FATTER_VEDTAK = 'FATTER_VEDTAK',
    IVERKSETTER_VEDTAK = 'IVERKSETTER_VEDTAK',
    FERDIGSTILT = 'FERDIGSTILT',
}

export const behandlingStatusTilTekst: Record<BehandlingStatus, string> = {
    OPPRETTET: 'Opprettet',
    UTREDES: 'Utredes',
    FATTER_VEDTAK: 'Fatter vedtak',
    IVERKSETTER_VEDTAK: 'Iverksetter vedtak',
    FERDIGSTILT: 'Ferdigstilt',
};

export const erBehandlingRedigerbar = (behandling: Behandling): boolean =>
    [BehandlingStatus.OPPRETTET, BehandlingStatus.UTREDES].includes(behandling.status);

export const erBehandlingUnderArbeid = (behandling: Behandling): boolean =>
    [BehandlingStatus.OPPRETTET, BehandlingStatus.UTREDES, BehandlingStatus.FATTER_VEDTAK].includes(
        behandling.status
    );
