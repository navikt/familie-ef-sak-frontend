import * as React from 'react';
import { FC } from 'react';
import { IOppholdstatus } from '../vilkår';
import TabellVisning, { TabellIkone } from '../../TabellVisning';
import { formaterNullableIsoDato } from '../../../../utils/formatter';

interface Props {
    oppholdsstatus: IOppholdstatus[];
}

const Oppholdsstatus: FC<Props> = ({ oppholdsstatus }) => (
    <TabellVisning
        ikone={TabellIkone.REGISTER}
        tittel="Oppholdsstatus"
        data={oppholdsstatus}
        headerValues={[
            {
                header: 'Oppholdstillatelse',
                value: (d) => d.oppholdstillatelse,
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

export default Oppholdsstatus;
