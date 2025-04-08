import { Stønadstype } from '../../../App/typer/behandlingstema';
import { Fagsak } from '../../../App/typer/fagsak';

export const utledTittel = (fagsak: Fagsak) => {
    switch (fagsak.stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
            return 'Overgangsstønad';
        case Stønadstype.BARNETILSYN:
            return 'Barnetilsyn';
        case Stønadstype.SKOLEPENGER:
            return 'Skolepenger';
        default:
            return 'Ukjent stønadstype';
    }
};
