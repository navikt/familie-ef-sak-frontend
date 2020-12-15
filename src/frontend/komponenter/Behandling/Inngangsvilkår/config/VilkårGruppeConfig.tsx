import { IDelvilkår, IInngangsvilkårGrunnlag, VilkårGruppe } from '../vilkår';
import * as React from 'react';
import { ReactChild } from 'react';
import MedlemskapVisning from '../Medlemskap/MedlemskapVisning';
import SivilstandVisning from '../Sivilstand/SivilstandVisning';
import { IVurderingConfig } from './VurderingConfig';
import OppholdVisning from '../Opphold/OppholdVisning';
import { VilkårStatus } from '../../../Felleskomponenter/Visning/VilkårOppfylt';

export interface IVilkårGruppeConfig {
    visning: (erOppfylt: boolean, inngangsvilkår: IInngangsvilkårGrunnlag) => ReactChild;
    filtrerBortUaktuelleDelvilkår?: () => IDelvilkår[];
}

export const VilkårGruppeConfig: IVurderingConfig<VilkårGruppe, IVilkårGruppeConfig> = {
    MEDLEMSKAP: {
        visning: (_erOppfylt: boolean, grunnlag: IInngangsvilkårGrunnlag): ReactChild => (
            <MedlemskapVisning
                medlemskap={grunnlag.medlemskap}
                vilkårStatus={VilkårStatus.IKKE_VURDERT}
            />
        ),
    },
    LOVLIG_OPPHOLD: {
        visning: (erOppfylt: boolean, grunnlag: IInngangsvilkårGrunnlag): ReactChild => (
            <OppholdVisning erOppfylt={erOppfylt} medlemskap={grunnlag.medlemskap} />
        ),
    },
    SIVILSTAND: {
        visning: (erOppfylt: boolean, grunnlag: IInngangsvilkårGrunnlag): ReactChild => (
            <SivilstandVisning erOppfylt={erOppfylt} sivilstand={grunnlag.sivilstand} />
        ),
    },
};
