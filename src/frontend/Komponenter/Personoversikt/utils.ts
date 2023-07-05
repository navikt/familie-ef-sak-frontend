import { BehandlingResultat, Fagsak } from '../../App/typer/fagsak';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { VedleggRequest } from './vedleggRequest';
import { Dokumentinfo } from '../../App/typer/dokumentliste';
import { ToggleName, Toggles } from '../../App/context/toggles';

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

export const skalViseLenke = (dokument: Dokumentinfo, toggles: Toggles): boolean => {
    return (
        (toggles[ToggleName.dokumentoversiktLinkTilDokument] || dokument.tema === 'ENF') &&
        dokument.harSaksbehandlerTilgang
    );
};
