import * as React from 'react';
import { FC } from 'react';
import { IOppholdstatus } from '../vilkår';
import TabellVisning, { TabellIkone } from '../../TabellVisning';
import { formaterIsoDato } from '../../../../utils/formatter';

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
                value: (d: IOppholdstatus) => d.oppholdstillatelse,
            },
            {
                header: 'Fra',
                value: (d: IOppholdstatus) => d.fraDato && formaterIsoDato(d.fraDato),
            },
            {
                header: 'Til',
                value: (d: IOppholdstatus) => d.tilDato && formaterIsoDato(d.tilDato),
            },
        ]}
    />
);

export default Oppholdsstatus;
