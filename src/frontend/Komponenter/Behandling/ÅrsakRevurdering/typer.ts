export interface ÅrsakRevurdering {
    årsak: Årsak;
    opplysningskilde: Opplysningskilde;
    beskrivelse?: string;
}

export enum Årsak {}

export enum Opplysningskilde {}
