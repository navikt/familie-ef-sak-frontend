import { DelvilkårType, UnntakType, VilkårType } from '../Inngangsvilkår/vilkår';

/**
 * Gjør det mulig å splitte opp vurderinger i eks Medlemskap, Aleneomsorg, etc.
 * Når man eks legger til en vurdering til medlemskap i VurderingConfig nå så kommer den opp automatisk
 */
export enum VilkårDel {
    MEDLEMSKAP = 'MEDLEMSKAP',
    SIVILSTAND = 'SIVILSTAND',
}

export interface IVilkårConfig {
    vilkårDel: VilkårDel;
    unntak?: UnntakType[];
    delvilkår: DelvilkårType[];
}

type IVurderingConfig = {
    [key in VilkårType]: IVilkårConfig;
};

export const VurderingConfig: IVurderingConfig = {
    FORUTGÅENDE_MEDLEMSKAP: {
        vilkårDel: VilkårDel.MEDLEMSKAP,
        unntak: [
            UnntakType.ARBEID_NORSK_ARBEIDSGIVER,
            UnntakType.UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER,
        ],
        delvilkår: [DelvilkårType.TRE_ÅRS_MEDLEMSKAP, DelvilkårType.DOKUMENTERT_FLYKTNINGSTATUS],
    },
    LOVLIG_OPPHOLD: {
        vilkårDel: VilkårDel.MEDLEMSKAP,
        unntak: [],
        delvilkår: [DelvilkårType.BOR_OG_OPPHOLDER_SEG_I_NORGE],
    },
};
