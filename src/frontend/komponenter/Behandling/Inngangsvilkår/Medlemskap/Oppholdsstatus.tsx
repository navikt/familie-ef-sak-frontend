import * as React from 'react';
import { FC } from 'react';
import { IOppholdstatus, oppholdsstatusTypeTilTekst } from '../vilkår';
import TabellVisning, { TabellIkon } from '../../TabellVisning';
import { formaterNullableIsoDato } from '../../../../utils/formatter';

interface Props {
    oppholdsstatus: IOppholdstatus[];
}

const Oppholdsstatus: FC<Props> = ({ oppholdsstatus }) => (
    <TabellVisning
        ikon={TabellIkon.REGISTER}
        tittel="Oppholdsstatus"
        verdier={oppholdsstatus}
        kolonner={[
            {
                overskrift: 'Oppholdstillatelse',
                tekstVerdi: (d) => oppholdsstatusTypeTilTekst[d.oppholdstillatelse],
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

export default Oppholdsstatus;
