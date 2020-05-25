// Interface

import { kjønnType } from '@navikt/familie-typer';

export interface ISaksøk {
    sakId: string;
    navn: INavn;
    personIdent: string;
    kjønn: kjønnType;
    adressebeskyttelse: Adressebeskyttelse;
    folkeregisterpersonstatus?: Folkeregisterpersonstatus;
}

export interface INavn {
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    visningsnavn: string;
}

export enum Adressebeskyttelse {
    STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
    FORTROLIG = 'FORTROLIG',
    UGRADERT = 'UGRADERT',
}

export enum Folkeregisterpersonstatus {
    BOSATT = 'BOSATT',
    UTFLYTTET = 'UTFLYTTET',
    FORSVUNNET = 'FORSVUNNET',
    DOED = 'DOED',
    OPPHOERT = 'OPPHOERT',
    FOEDSELSREGISTRERT = 'FOEDSELSREGISTRERT',
    MIDLERTIDIG = 'MIDLERTIDIG',
    INAKTIV = 'INAKTIV',
    UKJENT = 'UKJENT',
}
