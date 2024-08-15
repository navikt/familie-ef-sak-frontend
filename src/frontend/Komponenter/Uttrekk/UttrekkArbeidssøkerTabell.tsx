import React from 'react';
import { KopierbartNullableFødselsnummer } from '../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import AdressebeskyttelseVarsel from '../../Felles/Varsel/AdressebeskyttelseVarsel';
import { formaterNullableIsoDatoTid, nullableBooleanTilTekst } from '../../App/utils/formatter';
import { UttrekkArbeidssøker } from './UttrekkArbeidssøkerSide';
import { Button, Link, Table } from '@navikt/ds-react';
import { SmallTextLabel } from '../../Felles/Visningskomponenter/Tekster';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledTable = styled(Table)`
    width: 70%;
`;

const UttrekkArbeidssøkerTabell: React.FC<{
    arbeidssøkere: UttrekkArbeidssøker[];
    settKontrollert: (id: string, kontrollert: boolean) => void;
}> = ({ arbeidssøkere, settKontrollert }) => {
    const navigate = useNavigate();
    return (
        <StyledTable size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Person</Table.HeaderCell>
                    <Table.HeaderCell>Registrert som arbeidssøker i Arena</Table.HeaderCell>
                    <Table.HeaderCell>Kontrollert</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {arbeidssøkere.map((arbeidssøker) => {
                    return (
                        <Table.Row key={arbeidssøker.id}>
                            <Table.DataCell>
                                <div style={{ display: 'flex' }}>
                                    <Link
                                        role={'link'}
                                        href={'#'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/fagsak/${arbeidssøker.fagsakId}`);
                                        }}
                                        style={{ marginRight: '1rem' }}
                                    >
                                        <SmallTextLabel>{arbeidssøker.navn}</SmallTextLabel>
                                    </Link>
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={arbeidssøker.personIdent}
                                    />
                                    {arbeidssøker.adressebeskyttelse && (
                                        <AdressebeskyttelseVarsel
                                            adressebeskyttelse={arbeidssøker.adressebeskyttelse}
                                        />
                                    )}
                                </div>
                            </Table.DataCell>
                            <Table.DataCell>
                                {nullableBooleanTilTekst(arbeidssøker.registrertArbeidssøker)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {!arbeidssøker.kontrollert ? (
                                    <Button
                                        type={'button'}
                                        variant={'secondary'}
                                        onClick={() =>
                                            settKontrollert(
                                                arbeidssøker.id,
                                                !arbeidssøker.kontrollert
                                            )
                                        }
                                    >
                                        Sett kontrollert
                                    </Button>
                                ) : (
                                    <>
                                        {formaterNullableIsoDatoTid(arbeidssøker.kontrollertTid)} (
                                        {arbeidssøker.kontrollertAv})
                                        <Button
                                            type={'button'}
                                            variant={'tertiary'}
                                            style={{ marginLeft: '1rem' }}
                                            onClick={() =>
                                                settKontrollert(
                                                    arbeidssøker.id,
                                                    !arbeidssøker.kontrollert
                                                )
                                            }
                                        >
                                            Tilbakestill
                                        </Button>
                                    </>
                                )}
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </StyledTable>
    );
};

export default UttrekkArbeidssøkerTabell;
