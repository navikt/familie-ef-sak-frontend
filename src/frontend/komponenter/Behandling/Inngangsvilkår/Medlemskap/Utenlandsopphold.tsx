import * as React from 'react';
import { FC } from 'react';
import { IUtenlandsopphold } from '../vilkår';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
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
                value: (d) => d.årsak,
            },
            {
                header: 'Fra',
                value: (d) => formaterNullableIsoDato(d.fraDato),
            },
            {
                header: 'Til',
                value: (d) => formaterNullableIsoDato(d.tilDato),
            },
        ]}
    />
);

export default Utenlandsopphold;
