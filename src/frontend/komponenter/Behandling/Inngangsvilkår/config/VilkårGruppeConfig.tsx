import {
    AktivitetsvilkårType,
    InngangsvilkårType,
    IVilkårGrunnlag,
    Vilkårsresultat,
} from '../vilkår';
import * as React from 'react';
import { ReactChild } from 'react';
import MedlemskapVisning from '../Medlemskap/MedlemskapVisning';
import SivilstandVisning from '../Sivilstand/SivilstandVisning';
import OppholdVisning from '../Opphold/OppholdVisning';
import SamlivVisning from '../Samliv/SamlivVisning';
import AleneomsorgVisning from '../Aleneomsorg/AleneomsorgVisning';
import MorEllerFarVisning from '../MorEllerFar/MorEllerFarVisning';
import NyttBarnSammePartnerVisning from '../NyttBarnSammePartner/NyttBarnSammePartnerVisning';
import AktivitetVisning from '../../Aktivitet/Aktivitet/AktivitetVisning';
import SagtOppEllerRedusertVisning from '../../Aktivitet/SagtOppEllerRedusert/SagtOppEllerRedusertVisning';

export const VilkårGruppeConfig: Record<
    InngangsvilkårType | AktivitetsvilkårType,
    {
        visning: (
            inngangsvilkår: IVilkårGrunnlag,
            vilkårsresultat: Vilkårsresultat,
            barnId?: string
        ) => ReactChild;
    }
> = {
    FORUTGÅENDE_MEDLEMSKAP: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårsresultat: Vilkårsresultat): ReactChild => (
            <MedlemskapVisning medlemskap={grunnlag.medlemskap} vilkårsresultat={vilkårsresultat} />
        ),
    },
    LOVLIG_OPPHOLD: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårsresultat: Vilkårsresultat): ReactChild => (
            <OppholdVisning medlemskap={grunnlag.medlemskap} vilkårsresultat={vilkårsresultat} />
        ),
    },
    MOR_ELLER_FAR: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårsresultat: Vilkårsresultat): ReactChild => (
            <MorEllerFarVisning
                barnMedSamvær={grunnlag.barnMedSamvær}
                vilkårsresultat={vilkårsresultat}
            />
        ),
    },
    NYTT_BARN_SAMME_PARTNER: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårsresultat: Vilkårsresultat): ReactChild => (
            <NyttBarnSammePartnerVisning
                barnMedSamvær={grunnlag.barnMedSamvær}
                vilkårsresultat={vilkårsresultat}
            />
        ),
    },
    SIVILSTAND: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårsresultat: Vilkårsresultat): ReactChild => (
            <SivilstandVisning sivilstand={grunnlag.sivilstand} vilkårsresultat={vilkårsresultat} />
        ),
    },
    SAMLIV: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårsresultat: Vilkårsresultat): ReactChild => (
            <SamlivVisning grunnlag={grunnlag} vilkårsresultat={vilkårsresultat} />
        ),
    },
    ALENEOMSORG: {
        visning: (
            grunnlag: IVilkårGrunnlag,
            vilkårsresultat: Vilkårsresultat,
            barnId?: string
        ): ReactChild => (
            <AleneomsorgVisning
                vilkårsresultat={vilkårsresultat}
                barnMedSamvær={grunnlag.barnMedSamvær}
                barnId={barnId}
            />
        ),
    },
    AKTIVITET: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårsresultat: Vilkårsresultat): ReactChild => (
            <AktivitetVisning aktivitet={grunnlag.aktivitet} vilkårsresultat={vilkårsresultat} />
        ),
    },
    SAGT_OPP_ELLER_REDUSERT: {
        visning: (grunnlag: IVilkårGrunnlag, vilkårsresultat: Vilkårsresultat): ReactChild => (
            <SagtOppEllerRedusertVisning
                sagtOppEllerRedusert={grunnlag.sagtOppEllerRedusertStilling}
                vilkårsresultat={vilkårsresultat}
            />
        ),
    },
};
