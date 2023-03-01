import React from 'react';
import SkrivendeBlyant from '../Ikoner/SkrivendeBlyant';
import { IngenData, KolonneTitler } from './TabellWrapper';
import { IFullmakt } from '../../App/typer/personopplysninger';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import PersonopplysningerPanel from './PersonopplysningPanel';
import { Table } from '@navikt/ds-react';

const Fullmakter: React.FC<{ fullmakter: IFullmakt[] }> = ({ fullmakter }) => {
    return (
        <PersonopplysningerPanel Ikon={SkrivendeBlyant} tittel={'Fullmakter'}>
            {(fullmakter.length !== 0 && (
                <Table className="innhold" size="small">
                    <KolonneTitler
                        titler={['Fullmektig', 'Områder', 'Fødselsnummer', 'Fra', 'Til']}
                    />
                    <Table.Body>
                        {fullmakter.map((fullmakt, indeks) => {
                            return (
                                <Table.Row key={indeks}>
                                    <Table.DataCell>{fullmakt.navn}</Table.DataCell>
                                    <Table.DataCell>{fullmakt.områder.join()}</Table.DataCell>
                                    <Table.DataCell>{fullmakt.motpartsPersonident}</Table.DataCell>
                                    <Table.DataCell>
                                        {formaterNullableIsoDato(fullmakt.gyldigFraOgMed)}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {formaterNullableIsoDato(fullmakt.gyldigTilOgMed)}
                                    </Table.DataCell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            )) || <IngenData />}
        </PersonopplysningerPanel>
    );
};

export default Fullmakter;
