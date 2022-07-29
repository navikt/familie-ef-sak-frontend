import { BehandlingResultat, Fagsak } from '../../App/typer/fagsak';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { Behandlingstype } from '../../App/typer/behandlingstype';

export function erFullmaktOmraadeAktuelt(omraader: string[]) {
    return omraader.some((omraade) => omraade === 'Enslig forsørger' || omraade === 'Alle');
}

export function erAlleBehandlingerErFerdigstilt(fagsak: Fagsak) {
    return (
        fagsak.behandlinger.some(
            (behandling) => behandling.resultat !== BehandlingResultat.HENLAGT
        ) &&
        fagsak.behandlinger.every(
            (behandling) => behandling.status === BehandlingStatus.FERDIGSTILT
        ) &&
        fagsak.behandlinger.some(
            (behandling) =>
                behandling.type === Behandlingstype.REVURDERING ||
                behandling.type === Behandlingstype.FØRSTEGANGSBEHANDLING
        )
    );
}
