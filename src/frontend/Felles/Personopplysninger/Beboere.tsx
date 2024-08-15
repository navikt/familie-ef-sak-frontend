import React, { useCallback, useEffect, useState } from 'react';
import { ISøkeresultatPerson } from '../../App/typer/personopplysninger';
import { useApp } from '../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursFeilet, RessursStatus } from '../../App/typer/ressurs';
import DataViewer from '../DataViewer/DataViewer';
import SystemetLaster from '../SystemetLaster/SystemetLaster';
import { Table } from '@navikt/ds-react';

const Beboere: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { axiosRequest } = useApp();
    const [søkResultat, settSøkResultat] = useState<Ressurs<ISøkeresultatPerson>>(byggTomRessurs());

    const søkPerson = useCallback(
        (fagsakPersonId: string) => {
            axiosRequest<ISøkeresultatPerson, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/sok/fagsak-person/${fagsakPersonId}/samme-adresse`,
            }).then((respons: Ressurs<ISøkeresultatPerson> | RessursFeilet) => {
                settSøkResultat(respons);
            });
        },
        [axiosRequest]
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
                                {søkResultat.hits.map((beboer) => {
                                    return (
                                        <Table.Row key={beboer.personIdent}>
                                            <Table.DataCell textSize={'small'}>
                                                {beboer.visningsnavn}
                                            </Table.DataCell>
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
