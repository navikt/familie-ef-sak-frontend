import { Stønadstype } from './behandlingstema';
import { IFalskIdentitet, Kjønn } from './personopplysninger';

export interface ISøkPerson {
    fagsaker: {
        fagsakId: string;
        stønadstype: Stønadstype;
        erLøpende: boolean;
        erMigrert: boolean;
    }[];
    fagsakPersonId?: string;
    visningsnavn: string;
    personIdent: string;
    kjønn: Kjønn;
    falskIdentitet?: IFalskIdentitet;
}
