// Interface

import { kjønnType } from '@navikt/familie-typer';
import { INavn } from './personopplysninger';

export interface ISakSøkPersonIdent {
    personIdent: string;
}

export interface ISaksøk {
    sakId: string;
    navn: INavn;
    personIdent: string;
    kjønn: kjønnType;
}
