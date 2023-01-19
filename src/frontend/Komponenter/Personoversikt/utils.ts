import { BehandlingResultat, Fagsak } from '../../App/typer/fagsak';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { Behandlingstype } from '../../App/typer/behandlingstype';

export const alleBehandlingerErFerdigstiltEllerSattPåVent = (fagsak: Fagsak) =>
    fagsak.behandlinger.every(
        (behandling) =>
            behandling.status === BehandlingStatus.FERDIGSTILT ||
            (behandling.status === BehandlingStatus.SATT_PÅ_VENT &&
                behandling.type === Behandlingstype.REVURDERING)
    );

export function kanOppretteRevurdering(fagsak: Fagsak) {
    const harMinstEnBehandlingSomIkkeErHenlagt = fagsak.behandlinger.some(
        (behandling) => behandling.resultat !== BehandlingResultat.HENLAGT
    );

    const harBehandlingMedTypeFørstegangsbehandlingEllerRevurdering = fagsak.behandlinger.some(
        (behandling) =>
            behandling.type === Behandlingstype.REVURDERING ||
            behandling.type === Behandlingstype.FØRSTEGANGSBEHANDLING
    );

    return (
        harMinstEnBehandlingSomIkkeErHenlagt &&
        alleBehandlingerErFerdigstiltEllerSattPåVent(fagsak) &&
        harBehandlingMedTypeFørstegangsbehandlingEllerRevurdering
    );
}
