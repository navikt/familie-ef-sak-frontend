import * as React from 'react';
import { Dispatch, ReactChild, SetStateAction } from 'react';
import {
    DelvilkårType,
    IVilkårData,
    IVurdering,
    UnntakType,
    VilkårType,
} from '../Inngangsvilkår/vilkår';
import GenerellVurdering from './GenerellVurdering';
import MedlemskapVisning from '../Inngangsvilkår/Medlemskap/MedlemskapVisning';
import SivilstandVisning from '../Inngangsvilkår/Sivilstand/SivilstandVisning';

export interface VurderingProps {
    config: IVilkårConfig;
    vilkårData: IVilkårData;
    vurdering: IVurdering;
    settVurdering: Dispatch<SetStateAction<IVurdering>>;
    lagreKnapp: (visLagreKnapp: boolean) => ReactChild | undefined;
}

/**
 * Gjør det mulig å splitte opp vurderinger i eks Medlemskap, Aleneomsorg, etc.
 * Når man eks legger til en vurdering til medlemskap i VurderingConfig nå så kommer den opp automatisk
 */
export enum VilkårGruppe {
    MEDLEMSKAP = 'MEDLEMSKAP',
    SIVILSTAND = 'SIVILSTAND',
}

export interface IVilkårGruppeConfig {
    visning: (erOppfylt: boolean, inngangsvilkår: IVilkårData) => ReactChild;
}

type VilkårGruppeConfig = {
    [key in VilkårGruppe]: IVilkårGruppeConfig;
};

export const VilkårGruppeConfig: VilkårGruppeConfig = {
    MEDLEMSKAP: {
        visning: (erOppfylt: boolean, vilkårData: IVilkårData): ReactChild => (
            <MedlemskapVisning erOppfylt={erOppfylt} medlemskap={vilkårData.medlemskap} />
        ),
    },
    SIVILSTAND: {
        visning: (erOppfylt: boolean, vilkårData: IVilkårData): ReactChild => (
            <SivilstandVisning erOppfylt={erOppfylt} sivilstand={vilkårData.sivilstand} />
        ),
    },
};

export interface IVilkårConfig {
    vilkårGruppe: VilkårGruppe;
    vurdering: (props: VurderingProps) => ReactChild;
    unntak: UnntakType[];
    delvilkår: DelvilkårType[];
}

type IVurderingConfig = {
    [key in VilkårType]: IVilkårConfig;
};

//TODO burde vi legge till validering i config?

export const VurderingConfig: IVurderingConfig = {
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
