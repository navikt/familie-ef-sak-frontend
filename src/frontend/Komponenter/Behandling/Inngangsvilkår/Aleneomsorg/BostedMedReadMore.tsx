import { ReadMore, Table } from '@navikt/ds-react';
import React, { FC } from 'react';
import { IPersonalia } from '../vilkår';
import { IBarnMedSamvær } from './typer';

const BostedMedReadMore: FC<{
    personalia: IPersonalia;
    gjeldendeBarn: IBarnMedSamvær;
}> = ({ personalia, gjeldendeBarn }) => {
    return (
        <ReadMore header="Ikke registrert på brukers adresse" size="small" defaultOpen>
            {gjeldendeBarn.registergrunnlag.adresse ? (
                <>
                    Bruker og barnets folkeregistrerte bostedsadresser:
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
                                    {personalia.navn.visningsnavn}
                                </Table.DataCell>
                                <Table.DataCell textSize="small">
                                    {personalia.bostedsadresse?.visningsadresse}
                                </Table.DataCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.DataCell textSize="small">
                                    {gjeldendeBarn.registergrunnlag.navn}
                                </Table.DataCell>
                                <Table.DataCell textSize="small">
                                    {gjeldendeBarn.registergrunnlag.adresse}
                                </Table.DataCell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </>
            ) : (
                'Vi har ikke registrert noen adresse å sammenlikne med.'
            )}
        </ReadMore>
    );
};

export default BostedMedReadMore;
