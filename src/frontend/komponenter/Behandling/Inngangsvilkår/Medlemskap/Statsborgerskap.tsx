import * as React from 'react';
import { FC } from 'react';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { IStatsborgerskap } from '../../../../typer/personopplysninger';
import TabellVisning, { TabellIkon } from '../../TabellVisning';

interface Props {
    statsborgerskap: IStatsborgerskap[];
}

const Statsborgerskap: FC<Props> = ({ statsborgerskap }) => (
    <TabellVisning
        ikon={TabellIkon.REGISTER}
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
