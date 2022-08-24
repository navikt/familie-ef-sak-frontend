import { Behandling, BehandlingResultat } from '../../App/typer/fagsak';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { BehandlingRequest } from '../../App/hooks/useJournalføringState';

export const utledRiktigBehandlingstype = (
    tidligereBehandlinger: Behandling[]
): Behandlingstype => {
    const harIverksattTidligereBehandlinger = tidligereBehandlinger.some(
        (tidligereBehandling) => tidligereBehandling.resultat !== BehandlingResultat.HENLAGT
    );

    return harIverksattTidligereBehandlinger
        ? Behandlingstype.REVURDERING
        : Behandlingstype.FØRSTEGANGSBEHANDLING;
};

export const harValgtNyBehandling = (behandling: BehandlingRequest | undefined): boolean =>
    behandling !== undefined && behandling.behandlingsId === undefined;
