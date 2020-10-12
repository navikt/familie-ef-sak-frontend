import { UnntakType, VilkårType } from '../Inngangsvilkår/vilkår';

/**
 * Gjør det mulig å splitte opp vurderinger i eks Medlemskap, Aleneomsorg, etc.
 * Når man eks legger til en vurdering til medlemskap i VurderingConfig nå så kommer den opp automatisk
 */
export enum VilkårDel {
    MEDLEMSKAP = 'MEDLEMSKAP',
}

export interface IVilkårConfig {
    vilkårDel: VilkårDel;
    vilkår: string;
    unntak?: UnntakType[];
}

type IVurderingConfig = {
    [key in VilkårType]: IVilkårConfig;
};

export const VurderingConfig: IVurderingConfig = {
    FORUTGÅENDE_MEDLEMSKAP: {
        vilkårDel: VilkårDel.MEDLEMSKAP,
        vilkår: 'Vilkår for vurdering om utenlandsopphold er oppfylt',
        unntak: [
            UnntakType.ARBEID_NORSK_ARBEIDSGIVER,
            UnntakType.UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER,
        ],
    },
};
