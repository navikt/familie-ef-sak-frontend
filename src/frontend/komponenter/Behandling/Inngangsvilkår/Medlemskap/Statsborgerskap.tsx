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
        items={statsborgerskap}
        headerValues={[
            {
                header: 'Land',
                value: (d) => d.land,
            },
            {
                header: 'Fra',
                value: (d) => formaterNullableIsoDato(d.gyldigFraOgMedDato),
            },
            {
                header: 'Til',
                value: (d) => formaterNullableIsoDato(d.gyldigTilOgMedDato),
            },
        ]}
    />
);

export default Statsborgerskap;
