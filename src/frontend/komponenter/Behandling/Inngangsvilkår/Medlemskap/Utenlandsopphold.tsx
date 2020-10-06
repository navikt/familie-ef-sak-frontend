import * as React from 'react';
import { FC } from 'react';
import { IUtenlandsopphold } from '../vilkår';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import TabellVisning, { TabellIkon } from '../../TabellVisning';

interface Props {
    utenlandsopphold: IUtenlandsopphold[];
}

const Utenlandsopphold: FC<Props> = ({ utenlandsopphold }) => (
    <TabellVisning
        ikon={TabellIkon.SØKNAD}
        tittel="Utenlandsperioder"
        verdier={utenlandsopphold}
        kolonner={[
            {
                overskrift: 'Årsak',
                tekstVerdi: (d) => d.årsak,
            },
            {
                overskrift: 'Fra',
                tekstVerdi: (d) => formaterNullableIsoDato(d.fraDato),
            },
            {
                overskrift: 'Til',
                tekstVerdi: (d) => formaterNullableIsoDato(d.tilDato),
            },
        ]}
    />
);

export default Utenlandsopphold;
