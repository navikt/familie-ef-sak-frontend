import * as React from 'react';
import { FC } from 'react';
import { IOppholdstatus } from '../vilkår';
import TabellVisning, { TabellIkon } from '../../TabellVisning';
import { formaterNullableIsoDato } from '../../../../utils/formatter';

interface Props {
    oppholdsstatus: IOppholdstatus[];
}

const Oppholdsstatus: FC<Props> = ({ oppholdsstatus }) => (
    <TabellVisning
        ikon={TabellIkon.REGISTER}
        tittel="Oppholdsstatus"
        items={oppholdsstatus}
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
