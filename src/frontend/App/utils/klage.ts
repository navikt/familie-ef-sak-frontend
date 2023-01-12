import { KlageBehandling, KlagebehandlingStatus } from '../typer/klage';

export const harÅpenKlage = (behandlinger: KlageBehandling[]): boolean =>
    !behandlinger.every(
        (behandling: KlageBehandling) =>
            behandling.status === KlagebehandlingStatus.FERDIGSTILT ||
            behandling.status === KlagebehandlingStatus.VENTER
    );
