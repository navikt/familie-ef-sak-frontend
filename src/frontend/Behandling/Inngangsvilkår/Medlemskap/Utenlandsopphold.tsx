import * as React from 'react';
import { FC } from 'react';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';
import TabellVisning, { TabellIkon } from '../../Tabell/TabellVisning';
import { IUtenlandsopphold } from './typer';

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
                overskrift: 'Fra',
                tekstVerdi: (d) => formaterNullableIsoDato(d.fraDato),
            },
            {
                overskrift: 'Til',
                tekstVerdi: (d) => formaterNullableIsoDato(d.tilDato),
            },
            {
                overskrift: 'Årsak',
                tekstVerdi: (d) => d.årsak,
            },
        ]}
    />
);

export default Utenlandsopphold;
