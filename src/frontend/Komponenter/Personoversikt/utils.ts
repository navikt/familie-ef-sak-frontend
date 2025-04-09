import { Behandling, BehandlingResultat, Fagsak } from '../../App/typer/fagsak';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { VedleggRequest } from './vedleggRequest';
import { Dokumentinfo } from '../../App/typer/dokumentliste';
import { sorterBehandlinger } from '../../App/utils/behandlingutil';

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

const innvilgetEllerOpphørt = (b: Behandling) =>
    b.resultat === BehandlingResultat.INNVILGET || b.resultat === BehandlingResultat.OPPHØRT;

const filtrerBehandlinger = (fagsak: Fagsak): Behandling[] =>
    fagsak.behandlinger.filter(
        (b) => innvilgetEllerOpphørt(b) && b.status === BehandlingStatus.FERDIGSTILT
    );

export const filtrerOgSorterBehandlinger = (fagsak: Fagsak): Behandling[] =>
    filtrerBehandlinger(fagsak).sort(sorterBehandlinger);
