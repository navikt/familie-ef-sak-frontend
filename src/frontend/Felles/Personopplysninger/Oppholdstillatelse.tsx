import React from 'react';
import { KolonneTitler, SmallTabelMedTilpassetBredde } from './TabellWrapper';
import { IOppholdstillatelse, oppholdTilTekst } from '../../App/typer/personopplysninger';
import Pass from '../Ikoner/Pass';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import PersonopplysningerPanel from './PersonopplysningPanel';
import { Table } from '@navikt/ds-react';

const Oppholdstillatelse: React.FC<{ oppholdstillatelser: IOppholdstillatelse[] }> = ({
    oppholdstillatelser,
}) => {
    return (
        <PersonopplysningerPanel Ikon={Pass} tittel={'Oppholdstillatelse'}>
            {oppholdstillatelser.length !== 0 && (
                <SmallTabelMedTilpassetBredde>
                    <KolonneTitler titler={['Type', 'Fra', 'Til', '']} />
                    <Table.Body>
                        {oppholdstillatelser.map((oppholdstillatelse, indeks) => {
                            return (
                                <Table.Row key={indeks}>
                                    <Table.DataCell>
                                        {oppholdTilTekst[oppholdstillatelse.oppholdstillatelse]}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {formaterNullableIsoDato(oppholdstillatelse.fraDato)}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {formaterNullableIsoDato(oppholdstillatelse.tilDato)}
                                    </Table.DataCell>
                                    <Table.DataCell />
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </SmallTabelMedTilpassetBredde>
            )}
        </PersonopplysningerPanel>
    );
};

export default Oppholdstillatelse;
