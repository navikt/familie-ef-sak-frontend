import React from 'react';
import SkrivendeBlyant from '../Ikoner/SkrivendeBlyant';
import { IngenData, KolonneTitler, SmallTabelMedTilpassetBredde } from './TabellWrapper';
import { IFullmakt } from '../../App/typer/personopplysninger';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import PersonopplysningerPanel from './PersonopplysningPanel';
import { Table } from '@navikt/ds-react';
import { KopierbartNullableFødselsnummer } from '../Fødselsnummer/KopierbartNullableFødselsnummer';

const Fullmakter: React.FC<{ fullmakter: IFullmakt[] }> = ({ fullmakter }) => {
    return (
        <PersonopplysningerPanel Ikon={SkrivendeBlyant} tittel={'Fullmakter'}>
            {(fullmakter.length !== 0 && (
                <SmallTabelMedTilpassetBredde>
                    <KolonneTitler
                        titler={['Fullmektig', 'Fødselsnummer', 'Områder', 'Fra', 'Til']}
                    />
                    <Table.Body>
                        {fullmakter.map((fullmakt, indeks) => {
                            return (
                                <Table.Row key={indeks}>
                                    <Table.DataCell>{fullmakt.navn}</Table.DataCell>
                                    <Table.DataCell>
                                        <KopierbartNullableFødselsnummer
                                            fødselsnummer={fullmakt.motpartsPersonident}
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell>{fullmakt.områder.join()}</Table.DataCell>
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
                </SmallTabelMedTilpassetBredde>
            )) || <IngenData />}
        </PersonopplysningerPanel>
    );
};

export default Fullmakter;
