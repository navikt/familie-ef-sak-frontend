import * as React from 'react';
import { ReactChild } from 'react';
import { DelvilkårType, UnntakType, VilkårGruppe, VilkårType } from '../vilkår';
import GenerellVurdering from '../../Vurdering/GenerellVurdering';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import SivilstandVurdering from '../Sivilstand/SivilstandVurdering';
import SamlivVurdering from '../Samliv/SamlivVurdering';

export type IVurderingConfig<TYPE extends VilkårType | VilkårGruppe, CONFIG> = {
    [key in TYPE]: CONFIG;
};

export interface IVilkårConfig {
    vilkårGruppe: VilkårGruppe;
    renderVurdering: (props: VurderingProps) => ReactChild;
    unntak: UnntakType[];
    delvilkår: DelvilkårType[];
    begrunnelsePåkrevdHvisOppfylt: boolean;
}

export const VurderingConfig: IVurderingConfig<VilkårType, IVilkårConfig> = {
    FORUTGÅENDE_MEDLEMSKAP: {
        vilkårGruppe: VilkårGruppe.MEDLEMSKAP,
        renderVurdering: (props: VurderingProps): ReactChild => <GenerellVurdering props={props} />,
        unntak: [
            UnntakType.MEDLEM_MER_ENN_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR,
            UnntakType.MEDLEM_MER_ENN_7_ÅR_AVBRUDD_MER_ENN_10ÅR,
            UnntakType.I_LANDET_FOR_GJENFORENING_ELLER_GIFTE_SEG,
            UnntakType.ANDRE_FORELDER_MEDLEM_SISTE_5_ÅR,
            UnntakType.ANDRE_FORELDER_MEDLEM_MINST_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR,
            UnntakType.ANDRE_FORELDER_MEDLEM_MINST_7_ÅR_AVBRUDD_MER_ENN_10_ÅR,
            UnntakType.TOTALVURDERING_OPPFYLLER_FORSKRIFT,
            UnntakType.IKKE_OPPFYLT,
        ],
        delvilkår: [DelvilkårType.FEM_ÅRS_MEDLEMSKAP],
        begrunnelsePåkrevdHvisOppfylt: false,
    },
    LOVLIG_OPPHOLD: {
        vilkårGruppe: VilkårGruppe.LOVLIG_OPPHOLD,
        renderVurdering: (props: VurderingProps): ReactChild => <GenerellVurdering props={props} />,
        unntak: [
            UnntakType.ARBEID_NORSK_ARBEIDSGIVER,
            UnntakType.UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER,
            UnntakType.IKKE_OPPFYLT,
        ],
        delvilkår: [DelvilkårType.BOR_OG_OPPHOLDER_SEG_I_NORGE],
        begrunnelsePåkrevdHvisOppfylt: false,
    },
    SIVILSTAND: {
        vilkårGruppe: VilkårGruppe.SIVILSTAND,
        renderVurdering: (props: VurderingProps): ReactChild => (
            <SivilstandVurdering props={props} />
        ),
        unntak: [
            UnntakType.GJENLEVENDE_IKKE_RETT_TIL_YTELSER,
            UnntakType.GJENLEVENDE_OVERTAR_OMSORG,
            UnntakType.IKKE_OPPFYLT,
        ],
        delvilkår: [
            DelvilkårType.DOKUMENTERT_EKTESKAP,
            DelvilkårType.DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE,
            DelvilkårType.SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON,
            DelvilkårType.SAMSVAR_DATO_SEPARASJON_OG_FRAFLYTTING,
            DelvilkårType.KRAV_SIVILSTAND,
        ],
        begrunnelsePåkrevdHvisOppfylt: true,
    },
    SAMLIV: {
        vilkårGruppe: VilkårGruppe.SAMLIV,
        renderVurdering: (props: VurderingProps): ReactChild => <SamlivVurdering props={props} />,
        unntak: [UnntakType.IKKE_OPPFYLT],
        delvilkår: [
            DelvilkårType.HAR_FLYTTET_FRA_HVERANDRE,
            DelvilkårType.LEVER_IKKE_MED_ANNEN_FORELDER,
            DelvilkårType.LEVER_IKKE_I_EKTESKAPLIGNENDE_FORHOLD,
        ],
        begrunnelsePåkrevdHvisOppfylt: true,
    },
};
