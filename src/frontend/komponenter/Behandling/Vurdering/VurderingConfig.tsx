import * as React from 'react';
import { Dispatch, ReactChild, SetStateAction } from 'react';
import {
    DelvilkårType,
    IInngangsvilkår,
    IVurdering,
    UnntakType,
    VilkårType,
} from '../Inngangsvilkår/vilkår';
import GenerellVurdering from './GenerellVurdering';
import MedlemskapVisning from '../Inngangsvilkår/Medlemskap/MedlemskapVisning';

/**
 * Gjør det mulig å splitte opp vurderinger i eks Medlemskap, Aleneomsorg, etc.
 * Når man eks legger til en vurdering til medlemskap i VurderingConfig nå så kommer den opp automatisk
 */
export enum VilkårDel {
    MEDLEMSKAP = 'MEDLEMSKAP',
    SIVILSTAND = 'SIVILSTAND',
}

export interface IVilkårDelConfig {
    visning: (erOppfylt: boolean, inngangsvilkår: IInngangsvilkår) => ReactChild;
}

type VilkårDelConfig = {
    [key in VilkårDel]: IVilkårDelConfig;
};

export const VilkårDelConfig: VilkårDelConfig = {
    MEDLEMSKAP: {
        visning: (erOppfylt: boolean, inngangsvilkår: IInngangsvilkår): ReactChild => (
            <MedlemskapVisning erOppfylt={erOppfylt} medlemskap={inngangsvilkår.medlemskap} />
        ),
    },
    SIVILSTAND: {
        visning: (erOppfylt: boolean, inngangsvilkår: IInngangsvilkår): ReactChild => (
            <MedlemskapVisning erOppfylt={erOppfylt} medlemskap={inngangsvilkår.medlemskap} /> //TODO
        ),
    },
};

export interface IVilkårConfig {
    vilkårDel: VilkårDel;
    vurdering: (props: VurderingProps) => ReactChild;
    unntak: UnntakType[];
    delvilkår: DelvilkårType[];
}

type IVurderingConfig = {
    [key in VilkårType]: IVilkårConfig;
};

export interface VurderingProps {
    config: IVilkårConfig;
    vurdering: IVurdering;
    settVurdering: Dispatch<SetStateAction<IVurdering>>;
    lagreKnapp: (visLagreKnapp: boolean) => ReactChild | undefined;
}

//TODO burde vi legge till validering i config?

export const VurderingConfig: IVurderingConfig = {
    FORUTGÅENDE_MEDLEMSKAP: {
        vilkårDel: VilkårDel.MEDLEMSKAP,
        vurdering: (props: VurderingProps): ReactChild => <GenerellVurdering props={props} />,
        unntak: [
            UnntakType.ARBEID_NORSK_ARBEIDSGIVER,
            UnntakType.UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER,
            UnntakType.IKKE_OPPFYLT,
        ],
        delvilkår: [DelvilkårType.TRE_ÅRS_MEDLEMSKAP, DelvilkårType.DOKUMENTERT_FLYKTNINGSTATUS],
    },
    LOVLIG_OPPHOLD: {
        vilkårDel: VilkårDel.MEDLEMSKAP,
        vurdering: (props: VurderingProps): ReactChild => <GenerellVurdering props={props} />, //TODO ?
        unntak: [],
        delvilkår: [DelvilkårType.BOR_OG_OPPHOLDER_SEG_I_NORGE],
    },
    SIVILSTAND: {
        vilkårDel: VilkårDel.SIVILSTAND,
        vurdering: (props: VurderingProps): ReactChild => <GenerellVurdering props={props} />, //TODO
        unntak: [],
        delvilkår: [
            DelvilkårType.DOKUMENTERT_EKTESKAP,
            DelvilkårType.DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE,
            DelvilkårType.KRAV_SIVILSTAND,
        ],
    },
};
