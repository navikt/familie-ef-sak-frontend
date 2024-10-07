import { BehandlingResultat, Fagsak } from '../../App/typer/fagsak';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { VedleggRequest } from './vedleggRequest';
import { Dokumentinfo } from '../../App/typer/dokumentliste';

export const alleBehandlingerErFerdigstiltEllerSattPåVent = (fagsak: Fagsak) =>
    fagsak.behandlinger.every(
        (behandling) =>
            behandling.status === BehandlingStatus.FERDIGSTILT ||
            (behandling.status === BehandlingStatus.SATT_PÅ_VENT &&
                behandling.type === Behandlingstype.REVURDERING)
    );

export function utledKanOppretteRevurdering(fagsak: Fagsak) {
    const harMinstEnBehandlingSomIkkeErHenlagt = fagsak.behandlinger.some(
        (behandling) => behandling.resultat !== BehandlingResultat.HENLAGT
    );

    const harBehandlingMedTypeFørstegangsbehandlingEllerRevurdering = fagsak.behandlinger.some(
        (behandling) =>
            behandling.type === Behandlingstype.REVURDERING ||
            behandling.type === Behandlingstype.FØRSTEGANGSBEHANDLING
    );

    return {
        harKunHenlagteBehandlinger: !harMinstEnBehandlingSomIkkeErHenlagt,
        kanOppretteRevurdering:
            harMinstEnBehandlingSomIkkeErHenlagt &&
            alleBehandlingerErFerdigstiltEllerSattPåVent(fagsak) &&
            harBehandlingMedTypeFørstegangsbehandlingEllerRevurdering,
    };
}

export const oppdaterVedleggFilter = (
    object: VedleggRequest,
    key: keyof VedleggRequest,
    val?: string | number
): VedleggRequest => {
    if (!val || val === '') {
        // eslint-disable-next-line
        const { [key]: dummy, ...remainder } = object;
        return remainder as VedleggRequest;
    }
    return {
        ...object,
        [key]: val,
    };
};

export const skalViseLenke = (dokument: Dokumentinfo): boolean => dokument.harSaksbehandlerTilgang;
