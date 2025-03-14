import { FagsakPerson } from '../../App/typer/fagsak';

export const utledPersonIdent = (fagsakPerson: FagsakPerson) =>
    fagsakPerson.overgangsstønad?.personIdent ||
    fagsakPerson.barnetilsyn?.personIdent ||
    fagsakPerson.skolepenger?.personIdent;
