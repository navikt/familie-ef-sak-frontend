import * as React from 'react';
import { FC } from 'react';
import { IUtenlandsopphold } from '../vilkår';
import { formaterIsoDato } from '../../../../utils/formatter';
import TabellVisning, { TabellIkone } from '../../TabellVisning';

interface Props {
    utenlandsopphold: IUtenlandsopphold[];
}

const Utenlandsopphold: FC<Props> = ({ utenlandsopphold }) => (
    <TabellVisning
        ikone={TabellIkone.SØKNAD}
        tittel="Utenlandsperioder"
        data={utenlandsopphold}
        headerValues={[
            {
                header: 'Årsak',
                value: (d: IUtenlandsopphold) => d.årsak,
            },
            {
                header: 'Fra',
                value: (d: IUtenlandsopphold) => d.fraDato && formaterIsoDato(d.fraDato),
            },
            {
                header: 'Til',
                value: (d: IUtenlandsopphold) => d.tilDato && formaterIsoDato(d.tilDato),
            },
        ]}
    />
);

export default Utenlandsopphold;
