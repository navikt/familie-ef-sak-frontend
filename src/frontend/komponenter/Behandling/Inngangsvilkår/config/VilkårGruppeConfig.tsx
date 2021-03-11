import { IDelvilkår, IVilkårGrunnlag, VilkårGruppe } from '../vilkår';
import * as React from 'react';
import { ReactChild } from 'react';
import MedlemskapVisning from '../Medlemskap/MedlemskapVisning';
import SivilstandVisning from '../Sivilstand/SivilstandVisning';
import { IVurderingConfig } from './VurderingConfig';
import OppholdVisning from '../Opphold/OppholdVisning';
import { VilkårStatus } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import SamlivVisning from '../Samliv/SamlivVisning';
import AleneomsorgVisning from '../Aleneomsorg/AleneomsorgVisning';
import MorEllerFarVisning from '../MorEllerFar/MorEllerFarVisning';
import NyttBarnSammePartnerVisning from '../NyttBarnSammePartner/NyttBarnSammePartnerVisning';
import AktivitetVisning from '../../Aktivitet/Aktivitet/AktivitetVisning';

export interface IVilkårGruppeConfig {
    visning: (
        inngangsvilkår: IVilkårGrunnlag,
        vilkårStatus: VilkårStatus,
        barnId?: string
    ) => ReactChild;
    filtrerBortUaktuelleDelvilkår?: () => IDelvilkår[];
}

export const VilkårGruppeConfig: IVurderingConfig<VilkårGruppe, IVilkårGruppeConfig> = {
    MEDLEMSKAP: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårStatus: VilkårStatus): ReactChild => (
            <MedlemskapVisning medlemskap={grunnlag.medlemskap} vilkårStatus={vilkårStatus} />
        ),
    },
    LOVLIG_OPPHOLD: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårStatus: VilkårStatus): ReactChild => (
            <OppholdVisning medlemskap={grunnlag.medlemskap} vilkårStatus={vilkårStatus} />
        ),
    },
    MOR_ELLER_FAR: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårStatus: VilkårStatus): ReactChild => (
            <MorEllerFarVisning
                barnMedSamvær={grunnlag.barnMedSamvær}
                vilkårStatus={vilkårStatus}
            />
        ),
    },
    SIVILSTAND: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårStatus: VilkårStatus): ReactChild => (
            <SivilstandVisning sivilstand={grunnlag.sivilstand} vilkårStatus={vilkårStatus} />
        ),
    },
    SAMLIV: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårStatus: VilkårStatus): ReactChild => (
            <SamlivVisning grunnlag={grunnlag} vilkårStatus={vilkårStatus} />
        ),
    },
    ALENEOMSORG: {
        visning: (
            grunnlag: IVilkårGrunnlag,
            vilkårStatus: VilkårStatus,
            barnId?: string
        ): ReactChild => (
            <AleneomsorgVisning
                barnMedSamvær={grunnlag.barnMedSamvær}
                vilkårStatus={vilkårStatus}
                barnId={barnId}
            />
        ),
    },
    NYTT_BARN_SAMME_PARTNER: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårStatus: VilkårStatus): ReactChild => (
            <NyttBarnSammePartnerVisning
                barnMedSamvær={grunnlag.barnMedSamvær}
                vilkårStatus={vilkårStatus}
            />
        ),
    },
    AKTIVITET: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårStatus: VilkårStatus): ReactChild => (
            <AktivitetVisning aktivitet={grunnlag.aktivitet} vilkårStatus={vilkårStatus} />
        ),
    },
};
