import { BehandlingResultat, Fagsak } from '../../App/typer/fagsak';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { Behandlingstype } from '../../App/typer/behandlingstype';

export function kanOppretteRevurdering(fagsak: Fagsak) {
    const harMinstEnBehandlingSomIkkeErHenlagt = fagsak.behandlinger.some(
        (behandling) => behandling.resultat !== BehandlingResultat.HENLAGT
    );

    const alleBehandlingerErFerdigstiltEllerSattPåVent = fagsak.behandlinger.every(
        (behandling) =>
            behandling.status === BehandlingStatus.FERDIGSTILT ||
            (behandling.status === BehandlingStatus.SATT_PÅ_VENT &&
                behandling.type === Behandlingstype.REVURDERING)
    );

    const harBehandlingMedTypeFørstegangsbehandlingEllerRevurdering = fagsak.behandlinger.some(
        (behandling) =>
            behandling.type === Behandlingstype.REVURDERING ||
            behandling.type === Behandlingstype.FØRSTEGANGSBEHANDLING
    );

    return (
        harMinstEnBehandlingSomIkkeErHenlagt &&
        alleBehandlingerErFerdigstiltEllerSattPåVent &&
        harBehandlingMedTypeFørstegangsbehandlingEllerRevurdering
    );
}
