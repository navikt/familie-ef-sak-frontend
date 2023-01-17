import { Behandling } from './fagsak';

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

export enum ETaAvVentStatus {
    OK = 'OK',
    ANNEN_BEHANDLING_MÅ_FERDIGSTILLES = 'ANNEN_BEHANDLING_MÅ_FERDIGSTILLES',
    MÅ_NULSTILLE_VEDTAK = 'MÅ_NULSTILLE_VEDTAK',
}

export type TaAvVentStatus = {
    status: ETaAvVentStatus;
};
