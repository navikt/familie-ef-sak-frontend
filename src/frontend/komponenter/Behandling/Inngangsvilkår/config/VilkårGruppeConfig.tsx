import { IDelvilkår, IInngangsvilkårGrunnlag, VilkårGruppe } from '../vilkår';
import * as React from 'react';
import { ReactChild } from 'react';
import MedlemskapVisning from '../Medlemskap/MedlemskapVisning';
import SivilstandVisning from '../Sivilstand/SivilstandVisning';
import { IVurderingConfig } from './VurderingConfig';
import OppholdVisning from '../Opphold/OppholdVisning';
import { VilkårStatus } from '../../../Felleskomponenter/Visning/VilkårOppfylt';

export interface IVilkårGruppeConfig {
    visning: (inngangsvilkår: IInngangsvilkårGrunnlag, vilkårStatus: VilkårStatus) => ReactChild;
    filtrerBortUaktuelleDelvilkår?: () => IDelvilkår[];
}

export const VilkårGruppeConfig: IVurderingConfig<VilkårGruppe, IVilkårGruppeConfig> = {
    MEDLEMSKAP: {
        visning: (grunnlag: IInngangsvilkårGrunnlag, vilkårStatus: VilkårStatus): ReactChild => (
            <MedlemskapVisning medlemskap={grunnlag.medlemskap} vilkårStatus={vilkårStatus} />
        ),
    },
    LOVLIG_OPPHOLD: {
        visning: (grunnlag: IInngangsvilkårGrunnlag, vilkårStatus: VilkårStatus): ReactChild => (
            <OppholdVisning medlemskap={grunnlag.medlemskap} vilkårStatus={vilkårStatus} />
        ),
    },
    SIVILSTAND: {
        visning: (grunnlag: IInngangsvilkårGrunnlag, vilkårStatus: VilkårStatus): ReactChild => (
            <SivilstandVisning sivilstand={grunnlag.sivilstand} vilkårStatus={vilkårStatus} />
        ),
    },
};
