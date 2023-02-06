import * as React from 'react';
import { FC } from 'react';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { IStatsborgerskap } from '../../../../App/typer/personopplysninger';
import TabellVisning from '../../Vilkårpanel/TabellVisning';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    statsborgerskap: IStatsborgerskap[];
}

const Statsborgerskap: FC<Props> = ({ statsborgerskap }) => (
    <TabellVisning
        ikon={VilkårInfoIkon.REGISTER}
        tittel="Statsborgerskap"
        verdier={statsborgerskap}
        kolonner={[
            {
                overskrift: 'Land',
                tekstVerdi: (d) => d.land,
            },
            {
                overskrift: 'Fra',
                tekstVerdi: (d) => formaterNullableIsoDato(d.gyldigFraOgMedDato),
            },
            {
                overskrift: 'Til',
                tekstVerdi: (d) => formaterNullableIsoDato(d.gyldigTilOgMedDato),
            },
        ]}
    />
);

export default Statsborgerskap;
