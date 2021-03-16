import {VilkårType} from "../Inngangsvilkår/vilkår";

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
    begrunnelse: BegrunnelseRegel;
}

export type SvarMapping = Record<SvarId, Svarsalternativ>;

export interface Regel {
    regelId: string;
    svarMapping: SvarMapping;
}

export type Regler = {
    [key in RegelId]: Regel;
};

export type Vilkårsregler<T extends VilkårType> = {
    vilkårType: T;
    regler: Regler;
    rotregler: string[];
};

export interface ReglerResponse {
    vilkårsregler: {
        [key in VilkårType]: Vilkårsregler<key>;
    };
}

export type Begrunnelse = string | undefined;

//Från backend
export interface VilkårSvar {
    regelId: string;
    svarId: SvarId;
    begrunnelse?: Begrunnelse;
}

export interface Svar {
    regelId: string;
    svarId?: SvarId;
    begrunnelse?: Begrunnelse;
}

export type RootVilkårSvar = Record<string, VilkårSvar[]>;