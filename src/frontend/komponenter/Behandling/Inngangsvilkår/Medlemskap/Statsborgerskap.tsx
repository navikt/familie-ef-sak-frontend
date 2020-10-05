import * as React from 'react';
import { FC } from 'react';
import { formaterIsoDato } from '../../../../utils/formatter';
import { IStatsborgerskap } from '../../../../typer/personopplysninger';
import TabellVisning, { TabellIkone } from '../../TabellVisning';

interface Props {
    statsborgerskap: IStatsborgerskap[];
}

const Statsborgerskap: FC<Props> = ({ statsborgerskap }) => (
    <TabellVisning
        ikone={TabellIkone.REGISTER}
        tittel="Statsborgerskap"
        data={statsborgerskap}
        headerValues={[
            {
                header: 'Land',
                value: (d: IStatsborgerskap) => d.land,
            },
            {
                header: 'Fra',
                value: (d: IStatsborgerskap) =>
                    d.gyldigFraOgMedDato && formaterIsoDato(d.gyldigFraOgMedDato),
            },
            {
                header: 'Til',
                value: (d: IStatsborgerskap) =>
                    d.gyldigTilOgMedDato && formaterIsoDato(d.gyldigTilOgMedDato),
            },
        ]}
    />
);

export default Statsborgerskap;
