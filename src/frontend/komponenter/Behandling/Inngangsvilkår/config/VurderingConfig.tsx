import * as React from 'react';
import { ReactChild } from 'react';
import { DelvilkårType, UnntakType, VilkårGruppe, VilkårType } from '../vilkår';
import GenerellVurdering from '../../Vurdering/GenerellVurdering';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import SivilstandVurdering from '../Sivilstand/SivilstandVurdering';

export type IVurderingConfig<TYPE extends VilkårType | VilkårGruppe, CONFIG> = {
    [key in TYPE]: CONFIG;
};

export interface IVilkårConfig {
    vilkårGruppe: VilkårGruppe;
    renderVurdering: (props: VurderingProps) => ReactChild;
    unntak: UnntakType[];
    delvilkår: DelvilkårType[];
}

export const VurderingConfig: IVurderingConfig<VilkårType, IVilkårConfig> = {
    FORUTGÅENDE_MEDLEMSKAP: {
        vilkårGruppe: VilkårGruppe.MEDLEMSKAP,
        renderVurdering: (props: VurderingProps): ReactChild => <GenerellVurdering props={props} />,
        unntak: [
            UnntakType.ARBEID_NORSK_ARBEIDSGIVER,
            UnntakType.UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER,
            UnntakType.IKKE_OPPFYLT,
        ],
        delvilkår: [DelvilkårType.TRE_ÅRS_MEDLEMSKAP, DelvilkårType.DOKUMENTERT_FLYKTNINGSTATUS],
    },
    LOVLIG_OPPHOLD: {
        vilkårGruppe: VilkårGruppe.MEDLEMSKAP,
        renderVurdering: (props: VurderingProps): ReactChild => <GenerellVurdering props={props} />,
        unntak: [],
        delvilkår: [DelvilkårType.BOR_OG_OPPHOLDER_SEG_I_NORGE],
    },
    SIVILSTAND: {
        vilkårGruppe: VilkårGruppe.SIVILSTAND,
        renderVurdering: (props: VurderingProps): ReactChild => (
            <SivilstandVurdering props={props} />
        ),
        unntak: [],
        delvilkår: [
            DelvilkårType.DOKUMENTERT_EKTESKAP,
            DelvilkårType.DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE,
            DelvilkårType.KRAV_SIVILSTAND,
            DelvilkårType.SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON,
        ],
    },
};
