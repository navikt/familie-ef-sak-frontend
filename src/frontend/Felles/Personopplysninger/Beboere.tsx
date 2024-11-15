import React, { useCallback, useEffect, useState } from 'react';
import { IPersonFraSøk, ISøkeresultatPerson } from '../../App/typer/personopplysninger';
import { useApp } from '../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursFeilet, RessursStatus } from '../../App/typer/ressurs';
import DataViewer from '../DataViewer/DataViewer';
import SystemetLaster from '../SystemetLaster/SystemetLaster';
import { Table } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { nullableDatoTilAlder } from '../../App/utils/dato';

const StyledDataCell = styled(Table.DataCell)<{ person: IPersonFraSøk }>`
    font-weight: ${(props) => (props.person.erSøker || props.person.erBarn ? 'bold' : 'normal')};
`;

const Beboere: React.FC<{
    fagsakPersonId: string;
    settHenterBeboere: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ fagsakPersonId, settHenterBeboere }) => {
    const { axiosRequest } = useApp();
    const [søkResultat, settSøkResultat] = useState<Ressurs<ISøkeresultatPerson>>(byggTomRessurs());

    const søkPerson = useCallback(
        (fagsakPersonId: string) => {
            settHenterBeboere(true);
            axiosRequest<ISøkeresultatPerson, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/sok/fagsak-person/${fagsakPersonId}/samme-adresse`,
            }).then((respons: Ressurs<ISøkeresultatPerson> | RessursFeilet) => {
                settSøkResultat(respons);
                settHenterBeboere(false);
            });
        },
        [axiosRequest, settHenterBeboere]
    );

    useEffect(() => {
        søkPerson(fagsakPersonId);
    }, [fagsakPersonId, søkPerson]);

    return (
        <>
            {søkResultat.status === RessursStatus.IKKE_HENTET && <SystemetLaster />}
            <DataViewer response={{ søkResultat }}>
                {({ søkResultat }) => {
                    return (
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader textSize={'small'}>Navn</Table.ColumnHeader>
                                    <Table.ColumnHeader textSize={'small'}>
                                        Fødselsnummer
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader textSize={'small'}>
                                        Adresse
                                    </Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {søkResultat.personer.map((beboer) => {
                                    return (
                                        <Table.Row key={beboer.personIdent}>
                                            <StyledDataCell person={beboer} textSize={'small'}>
                                                {`${beboer.visningsnavn} ${beboer.fødselsdato ? `(${nullableDatoTilAlder(beboer.fødselsdato)})` : ''}`}
                                            </StyledDataCell>
                                            <Table.DataCell textSize={'small'}>
                                                {beboer.personIdent}
                                            </Table.DataCell>
                                            <Table.DataCell textSize={'small'}>
                                                {beboer.visningsadresse}
                                            </Table.DataCell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    );
                }}
            </DataViewer>
        </>
    );
};

export default Beboere;
