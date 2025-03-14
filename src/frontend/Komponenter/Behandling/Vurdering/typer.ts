import { VilkårType } from '../Inngangsvilkår/vilkår';

export enum BegrunnelseRegel {
    'PÅKREVD' = 'PÅKREVD',
    'VALGFRI' = 'VALGFRI',
    'UTEN' = 'UTEN',
}

export type SluttNode = 'SLUTT_NODE';

export type RegelId = SluttNode | string;
export type SvarId = string;

export interface Svarsalternativ {
    regelId: RegelId;
    begrunnelseType: BegrunnelseRegel;
}

export type SvarMapping = Record<SvarId, Svarsalternativ>;

export enum RegelVersjon {
    GJELDENDE = 'GJELDENDE',
    HISTORISK = 'HISTORISK',
}

export interface Regel {
    regelId: string;
    svarMapping: SvarMapping;
    versjon: RegelVersjon;
}

export type Regler = {
    [key in RegelId]: Regel;
};

export type Vilkårsregler<T extends VilkårType> = {
    vilkårType: T;
    regler: Regler;
};

export interface ReglerResponse {
    vilkårsregler: {
        [key in VilkårType]: Vilkårsregler<key>;
    };
}

export type Begrunnelse = string | undefined;
