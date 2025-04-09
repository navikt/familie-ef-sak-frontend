import { BehandlingStatus } from '../../../App/typer/behandlingstatus';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { BehandlingResultat, Fagsak, FagsakPerson } from '../../../App/typer/fagsak';

export enum ValgtStønad {
    OVERGANGSSTØNAD = 'overgangsstønad',
    BARNETILSYN = 'barnetilsyn',
    SKOLEPENGER = 'skolepenger',
}

export const utledTittel = (fagsak: Fagsak) => {
    switch (fagsak.stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
            return ValgtStønad.OVERGANGSSTØNAD;
        case Stønadstype.BARNETILSYN:
            return ValgtStønad.BARNETILSYN;
        case Stønadstype.SKOLEPENGER:
            return ValgtStønad.SKOLEPENGER;
        default:
            return 'Ukjent stønadstype';
    }
};

export const finnesEnFerdigBehandling = (fagsak: Fagsak) => {
    return fagsak.behandlinger.some(
        (behandling) =>
            behandling.resultat === BehandlingResultat.INNVILGET &&
            behandling.status === BehandlingStatus.FERDIGSTILT
    );
};

export const utledDefaultValgtStønad = (fagsakPerson: FagsakPerson): ValgtStønad[] => {
    const defaultStønader: ValgtStønad[] = [];

    if (fagsakPerson.overgangsstønad && finnesEnFerdigBehandling(fagsakPerson.overgangsstønad)) {
        defaultStønader.push(ValgtStønad.OVERGANGSSTØNAD);
    }

    if (fagsakPerson.barnetilsyn && finnesEnFerdigBehandling(fagsakPerson.barnetilsyn)) {
        defaultStønader.push(ValgtStønad.BARNETILSYN);
    }

    if (fagsakPerson.skolepenger && finnesEnFerdigBehandling(fagsakPerson.skolepenger)) {
        defaultStønader.push(ValgtStønad.SKOLEPENGER);
    }

    return defaultStønader;
};

export const harBehandling = (stønaderMedBehandling: ValgtStønad[], stønad: ValgtStønad) => {
    return stønaderMedBehandling.includes(stønad);
};
