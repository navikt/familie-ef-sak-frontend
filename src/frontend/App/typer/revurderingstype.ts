import { Behandlingsårsak } from './Behandlingsårsak';

export interface BarnForRevurdering {
    personIdent: string;
    navn: string;
    fødselsdato: string;
}

export interface RevurderingInnhold {
    fagsakId: string;
    behandlingsårsak: Behandlingsårsak;
    kravMottatt: string;
    barn: BarnForRevurdering[];
}
