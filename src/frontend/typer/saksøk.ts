// Interface

import { kjønnType } from '@navikt/familie-typer';

export interface ISakSøkPersonIdent {
    personIdent: string;
}

export interface ISaksøk {
    fagsaker: string[];
    visningsnavn: string;
    personIdent: string;
    kjønn: kjønnType;
}
