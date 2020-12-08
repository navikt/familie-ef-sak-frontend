import { IDelvilkår, IInngangsvilkårGrunnlag, VilkårGruppe } from '../vilkår';
import * as React from 'react';
import { ReactChild } from 'react';
import MedlemskapVisning from '../Medlemskap/MedlemskapVisning';
import SivilstandVisning from '../Sivilstand/SivilstandVisning';
import { IVurderingConfig } from './VurderingConfig';

export interface IVilkårGruppeConfig {
    visning: (erOppfylt: boolean, inngangsvilkår: IInngangsvilkårGrunnlag) => ReactChild;
    filtrerBortUaktuelleDelvilkår?: () => IDelvilkår[];
}

export const VilkårGruppeConfig: IVurderingConfig<VilkårGruppe, IVilkårGruppeConfig> = {
    MEDLEMSKAP: {
        visning: (erOppfylt: boolean, grunnlag: IInngangsvilkårGrunnlag): ReactChild => (
            <MedlemskapVisning erOppfylt={erOppfylt} medlemskap={grunnlag.medlemskap} />
        ),
    },
    SIVILSTAND: {
        visning: (erOppfylt: boolean, grunnlag: IInngangsvilkårGrunnlag): ReactChild => (
            <SivilstandVisning erOppfylt={erOppfylt} sivilstand={grunnlag.sivilstand} />
        ),
    },
};
