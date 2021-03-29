import { AktivitetsvilkårType, IVilkårGrunnlag, Vilkårsresultat } from '../vilkår';
import * as React from 'react';
import { ReactChild } from 'react';
import AktivitetVisning from '../../Aktivitet/Aktivitet/AktivitetVisning';
import SagtOppEllerRedusertVisning from '../../Aktivitet/SagtOppEllerRedusert/SagtOppEllerRedusertVisning';

export const VilkårGruppeConfig: Record<
    AktivitetsvilkårType,
    {
        visning: (inngangsvilkår: IVilkårGrunnlag, vilkårsresultat: Vilkårsresultat) => ReactChild;
    }
> = {
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
