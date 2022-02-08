// Interface

import { kjønnType } from '@navikt/familie-typer';
import { Stønadstype } from './behandlingstema';

export interface IFagsaksøk {
    fagsaker: {
        fagsakId: string;
        stønadstype: Stønadstype;
        erLøpende: boolean;
        erMigrert: boolean;
    }[];
    fagsakPersonId?: string;
    visningsnavn: string;
    personIdent: string;
    kjønn: kjønnType;
}
