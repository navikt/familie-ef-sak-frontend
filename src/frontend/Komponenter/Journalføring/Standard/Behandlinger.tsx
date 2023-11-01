import React, { Dispatch, SetStateAction } from 'react';
import { BodyShort, Button, HStack, Table, VStack } from '@navikt/ds-react';
import { Fagsak } from '../../../App/typer/fagsak';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import { behandlingStatusTilTekst } from '../../../App/typer/behandlingstatus';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';
import { alleBehandlingerErFerdigstiltEllerSattPåVent } from '../../Personoversikt/utils';
import { utledRiktigBehandlingstype } from '../Felles/utils';
import { TrashIcon } from '@navikt/aksel-icons';
import styled from 'styled-components';
import {
    Journalføringsaksjon,
    JournalføringStateRequest,
} from '../../../App/hooks/useJournalføringState';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';

const StyledDataCell = styled(Table.DataCell)`
    padding: 0;
`;

const FjernBehandlingButton = styled(Button)`
    margin-right: 0.5rem;
`;

const TekstContainer = styled.div`
    padding-left: 1rem;
    padding-right: 1rem;
`;

const BodyShortItalic = styled(BodyShort)`
    font-style: italic;
    width: 47rem;
`;

interface Props {
    journalpostState: JournalføringStateRequest;
    settFeilmelding: Dispatch<SetStateAction<string>>;
}

const Behandlinger: React.FC<Props> = ({ journalpostState, settFeilmelding }) => {
    const { fagsak, journalføringsaksjon, settJournalføringsaksjon, stønadstype } =
        journalpostState;

    const leggTilNyBehandlingForOpprettelse = (fagsak: Fagsak) => {
        settFeilmelding('');
        const kanOppretteNyBehandling = alleBehandlingerErFerdigstiltEllerSattPåVent(fagsak);

        if (kanOppretteNyBehandling) {
            settJournalføringsaksjon(Journalføringsaksjon.OPPRETT_BEHANDLING);
        } else {
            settFeilmelding(
                'Kan ikke opprette ny behandling. Denne fagsaken har en behandling som ikke er ferdigstilt.'
            );
        }
    };

    const skalOppretteNyBehandling =
        journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING;

    return (
        <DataViewer response={{ fagsak }}>
            {({ fagsak }) => {
                const behandlinger = stønadstype ? fagsak.behandlinger.slice().reverse() : [];
                const behandlingstypePåNyBehandling =
                    behandlingstypeTilTekst[utledRiktigBehandlingstype(fagsak.behandlinger)];

                return (
                    <VStack gap="4">
                        <AlertInfo>
                            Merk at du ikke lenger trenger å knytte dokumenter til spesifikke
                            behandlinger da de automatisk knyttes til bruker. Du kan i listen under
                            få oversikt over tidligere behandlinger og vurdere om det skal opprettes
                            en ny behandling fra denne journalføringen.
                        </AlertInfo>
                        <Table zebraStripes={true}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell scope={'col'}>Behandling</Table.HeaderCell>
                                    <Table.HeaderCell scope={'col'}>Status</Table.HeaderCell>
                                    <Table.HeaderCell scope={'col'}>Sist endret</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {skalOppretteNyBehandling && (
                                    <Table.Row>
                                        <Table.DataCell>
                                            {behandlingstypePåNyBehandling}
                                        </Table.DataCell>
                                        <Table.DataCell>Opprettes ved journalføring</Table.DataCell>
                                        <StyledDataCell>
                                            <HStack justify={'end'}>
                                                <FjernBehandlingButton
                                                    type={'button'}
                                                    onClick={() =>
                                                        settJournalføringsaksjon(
                                                            Journalføringsaksjon.JOURNALFØR_PÅ_FAGSAK
                                                        )
                                                    }
                                                    variant={'tertiary'}
                                                    icon={<TrashIcon title={'fjern rad'} />}
                                                />
                                            </HStack>
                                        </StyledDataCell>
                                    </Table.Row>
                                )}
                                {behandlinger.map((behandling) => (
                                    <Table.Row key={behandling.id}>
                                        <Table.DataCell>
                                            {behandlingstypeTilTekst[behandling.type]}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {behandlingStatusTilTekst[behandling.status]}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {formaterIsoDatoTid(behandling.sistEndret)}
                                        </Table.DataCell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        {behandlinger.length === 0 && (
                            <TekstContainer>
                                <BodyShortItalic>
                                    Det finnes ingen behandlinger på denne fagsaken til brukeren. Du
                                    kan opprette en behandling eller journalføre på bruker uten
                                    behandling (lik generell sak i Gosys)
                                </BodyShortItalic>
                            </TekstContainer>
                        )}
                        <LeggTilKnapp
                            onClick={() => leggTilNyBehandlingForOpprettelse(fagsak)}
                            knappetekst={'Opprett ny behandling'}
                            size={'small'}
                            disabled={skalOppretteNyBehandling}
                        />
                    </VStack>
                );
            }}
        </DataViewer>
    );
};

export default Behandlinger;
