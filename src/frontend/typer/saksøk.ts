// Interface

import { kjønnType } from '@navikt/familie-typer';

export interface ISaksøk {
    sakId: string;
    navn: INavn;
    personIdent: string;
    kjønn: kjønnType;
}
export interface INavn {
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    visningsnavn: string;
}
