import * as React from 'react';
import { ReactChild } from 'react';
import { DelvilkårType, IVilkårdata, UnntakType, VilkårGruppe, VilkårType } from '../vilkår';
import GenerellVurdering from '../../Vurdering/GenerellVurdering';
import MedlemskapVisning from '../Medlemskap/MedlemskapVisning';
import SivilstandVisning from '../Sivilstand/SivilstandVisning';
import { VurderingProps } from '../../Vurdering/VurderingProps';

type IVurderingConfig<TYPE extends VilkårType | DelvilkårType | VilkårGruppe, CONFIG> = {
    [key in TYPE]: CONFIG;
};

export interface IVilkårGruppeConfig {
    visning: (erOppfylt: boolean, inngangsvilkår: IVilkårdata) => ReactChild;
}

export const VilkårGruppeConfig: IVurderingConfig<VilkårGruppe, IVilkårGruppeConfig> = {
    MEDLEMSKAP: {
        visning: (erOppfylt: boolean, vilkårdata: IVilkårdata): ReactChild => (
            <MedlemskapVisning erOppfylt={erOppfylt} medlemskap={vilkårdata.medlemskap} />
        ),
    },
    SIVILSTAND: {
        visning: (erOppfylt: boolean, vilkårdata: IVilkårdata): ReactChild => (
            <SivilstandVisning erOppfylt={erOppfylt} sivilstand={vilkårdata.sivilstand} />
        ),
    },
};

export interface IVilkårConfig {
    vilkårGruppe: VilkårGruppe;
    vurdering: (props: VurderingProps) => ReactChild;
    unntak: UnntakType[];
    delvilkår: DelvilkårType[];
}

export const VurderingConfig: IVurderingConfig<VilkårType, IVilkårConfig> = {
    FORUTGÅENDE_MEDLEMSKAP: {
        vilkårGruppe: VilkårGruppe.MEDLEMSKAP,
        vurdering: (props: VurderingProps): ReactChild => <GenerellVurdering props={props} />,
        unntak: [
            UnntakType.ARBEID_NORSK_ARBEIDSGIVER,
            UnntakType.UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER,
            UnntakType.IKKE_OPPFYLT,
        ],
        delvilkår: [DelvilkårType.TRE_ÅRS_MEDLEMSKAP, DelvilkårType.DOKUMENTERT_FLYKTNINGSTATUS],
    },
    LOVLIG_OPPHOLD: {
        vilkårGruppe: VilkårGruppe.MEDLEMSKAP,
        vurdering: (props: VurderingProps): ReactChild => <GenerellVurdering props={props} />,
        unntak: [],
        delvilkår: [DelvilkårType.BOR_OG_OPPHOLDER_SEG_I_NORGE],
    },
    SIVILSTAND: {
        vilkårGruppe: VilkårGruppe.SIVILSTAND,
        vurdering: (props: VurderingProps): ReactChild => <GenerellVurdering props={props} />,
        unntak: [],
        delvilkår: [
            DelvilkårType.DOKUMENTERT_EKTESKAP,
            DelvilkårType.DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE,
            DelvilkårType.KRAV_SIVILSTAND,
        ],
    },
};
