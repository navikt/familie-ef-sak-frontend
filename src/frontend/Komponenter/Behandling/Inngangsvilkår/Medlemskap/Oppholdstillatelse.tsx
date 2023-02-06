import * as React from 'react';
import { FC } from 'react';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { IOppholdstatus, oppholdsstatusTypeTilTekst } from './typer';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import TabellVisning from '../../Tabell/TabellVisning';

interface Props {
    oppholdsstatus: IOppholdstatus[];
}

const Oppholdstillatelse: FC<Props> = ({ oppholdsstatus }) => (
    <TabellVisning
        ikon={VilkårInfoIkon.REGISTER}
        tittel="Oppholdstillatelse"
        verdier={oppholdsstatus}
        kolonner={[
            {
                overskrift: 'Type',
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

export default Oppholdstillatelse;
