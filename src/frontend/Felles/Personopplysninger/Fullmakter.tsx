import React from 'react';
import SkrivendeBlyant from '../Ikoner/SkrivendeBlyant';
import { KolonneTitler, SmallTable } from './TabellWrapper';
import { IFullmakt } from '../../App/typer/personopplysninger';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import PersonopplysningerPanel from './PersonopplysningPanel';
import { BodyShort, Table } from '@navikt/ds-react';
import { KopierbartNullableFødselsnummer } from '../Fødselsnummer/KopierbartNullableFødselsnummer';

const Fullmakter: React.FC<{ fullmakter: IFullmakt[] | null }> = ({ fullmakter }) => {
    return (
        <PersonopplysningerPanel Ikon={SkrivendeBlyant} tittel={'Fullmakter'}>
            {fullmakter === null && (
                <BodyShort>
                    Fullmakt er ukjent. Du mangler tilgang til å se fullmaktsinformasjon for denne
                    personen.
                </BodyShort>
            )}
            {fullmakter && fullmakter.length !== 0 && (
                <SmallTable>
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
                                        {fullmakt.gyldigTilOgMed
                                            ? formaterNullableIsoDato(fullmakt.gyldigTilOgMed)
                                            : '-'}
                                    </Table.DataCell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </SmallTable>
            )}
        </PersonopplysningerPanel>
    );
};

export default Fullmakter;
