import { Behandling, BehandlingResultat, Fagsak } from '../../App/typer/fagsak';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { BehandlingRequest } from '../../App/hooks/useJournalføringState';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';

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

export const erAlleBehandlingerFerdigstilte = (fagsak: Ressurs<Fagsak>): boolean =>
    fagsak.status === RessursStatus.SUKSESS &&
    fagsak.data.behandlinger.every((b) => b.status === BehandlingStatus.FERDIGSTILT);
