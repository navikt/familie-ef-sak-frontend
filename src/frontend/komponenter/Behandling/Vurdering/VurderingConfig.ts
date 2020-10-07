import { UnntakType, VilkårType } from '../Inngangsvilkår/vilkår';

export enum VilkårDel {
    MEDLEMSKAP = 'MEDLEMSKAP',
}

interface IVilkårConfig {
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
