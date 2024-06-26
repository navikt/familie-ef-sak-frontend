import { ReadMore, Table } from '@navikt/ds-react';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { useGjeldendeBarn } from '../../../../App/hooks/useGjeldeneBarn';
import { IAdresse } from '../../../../App/typer/personopplysninger';

const StyledReadMore = styled(ReadMore)`
    --ac-read-more-text: var(--a-text-default);
`;

const ReadMoreMedAdresser: FC<{ barnIdent?: string }> = ({ barnIdent }) => {
    const { personopplysningerResponse } = useBehandling();
    const gjeldendeBarn = useGjeldendeBarn(barnIdent);

    const sisteAdresse = (adresse: IAdresse[]) => {
        return adresse[adresse.length - 1]?.visningsadresse;
    };

    return (
        <DataViewer response={{ personopplysningerResponse }}>
            {({ personopplysningerResponse }) => (
                <StyledReadMore
                    header="Ikke registrert på brukers adresse"
                    size="small"
                    defaultOpen={true}
                >
                    {gjeldendeBarn?.adresse ? (
                        <>
                            Dette er adressene vi har registrert på bruker og gjeldene barn:
                            <Table size="small" style={{ marginTop: '0.5rem' }}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell scope="col" textSize="small">
                                            Navn
                                        </Table.HeaderCell>
                                        <Table.HeaderCell scope="col" textSize="small">
                                            Adresse
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.DataCell textSize="small">
                                            {personopplysningerResponse.navn.visningsnavn}
                                        </Table.DataCell>
                                        <Table.DataCell textSize="small">
                                            {sisteAdresse(personopplysningerResponse.adresse)}
                                        </Table.DataCell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.DataCell textSize="small">
                                            {gjeldendeBarn?.navn}
                                        </Table.DataCell>
                                        <Table.DataCell textSize="small">
                                            {sisteAdresse(gjeldendeBarn.adresse)}
                                        </Table.DataCell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </>
                    ) : (
                        'Vi har ikke registrert noen adresse å sammenlikne med.'
                    )}
                </StyledReadMore>
            )}
        </DataViewer>
    );
};

export default ReadMoreMedAdresser;
