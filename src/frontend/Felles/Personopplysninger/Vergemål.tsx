import React from 'react';
import SkrivendeBlyant from '../Ikoner/SkrivendeBlyant';
import { IngenData, KolonneTitler } from './TabellWrapper';
import {
    IVergemål,
    vergemålOmfangTilTekst,
    vergemålTypeTilTekst,
} from '../../App/typer/personopplysninger';
import { tekstMapping } from '../../App/utils/tekstmapping';
import PersonopplysningerPanel from './PersonopplysningPanel';
import { Table } from '@navikt/ds-react';

const Vergemål: React.FC<{ vergemål: IVergemål[] }> = ({ vergemål }) => {
    return (
        <PersonopplysningerPanel Ikon={SkrivendeBlyant} tittel={'Vergemål'}>
            {(vergemål.length !== 0 && (
                <Table className="innhold" size="small">
                    <KolonneTitler
                        titler={['Type', 'Omfang', 'Verge', 'Fødselsnummer', 'Embete']}
                    />
                    <Table.Body>
                        {vergemål.map((vergemål, indeks) => {
                            return (
                                <Table.Row key={indeks}>
                                    <Table.DataCell>
                                        {tekstMapping(vergemål.type, vergemålTypeTilTekst)}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {tekstMapping(vergemål.omfang, vergemålOmfangTilTekst)}
                                    </Table.DataCell>
                                    <Table.DataCell>{vergemål.navn}</Table.DataCell>
                                    <Table.DataCell>{vergemål.motpartsPersonident}</Table.DataCell>
                                    <Table.DataCell>{vergemål.embete}</Table.DataCell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            )) || <IngenData />}
        </PersonopplysningerPanel>
    );
};

export default Vergemål;
