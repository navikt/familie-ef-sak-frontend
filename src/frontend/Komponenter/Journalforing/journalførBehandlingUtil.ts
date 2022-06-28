import { Behandling, BehandlingResultat } from '../../App/typer/fagsak';
import { Behandlingstype } from '../../App/typer/behandlingstype';

export const utledRiktigBehandlingstype = (
    tidligereBehandlinger: Behandling[]
): Behandlingstype => {
    const harIverksattTidligereBehandlinger = tidligereBehandlinger.some(
        (tidligereBehandling) =>
            tidligereBehandling.resultat !== BehandlingResultat.HENLAGT
    );

    return harIverksattTidligereBehandlinger
        ? Behandlingstype.REVURDERING
        : Behandlingstype.FØRSTEGANGSBEHANDLING;
};
