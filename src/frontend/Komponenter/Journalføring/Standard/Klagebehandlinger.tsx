import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { BodyShort, Button, HStack, Table, VStack } from '@navikt/ds-react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';
import { stønadstypeTilKey } from '../Felles/utils';
import { TrashIcon } from '@navikt/aksel-icons';
import styled from 'styled-components';
import {
    Journalføringsaksjon,
    JournalføringStateRequest,
} from '../../../App/hooks/useJournalføringState';
import { useHentKlagebehandlinger } from '../../../App/hooks/useHentKlagebehandlinger';
import { RessursStatus } from '../../../App/typer/ressurs';
import { KlagebehandlingStatusTilTekst } from '../../../App/typer/klage';
import { harÅpenKlage } from '../../../App/utils/klage';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';

const StyledDataCell = styled(Table.DataCell)`
    padding: 0;
`;

const FjernBehandlingButton = styled(Button)`
    margin-right: 1rem;
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

const Klagebehandlinger: React.FC<Props> = ({ journalpostState, settFeilmelding }) => {
    const { fagsak, journalføringsaksjon, settJournalføringsaksjon, stønadstype } =
        journalpostState;
    const { klagebehandlinger, hentKlagebehandlinger } = useHentKlagebehandlinger();

    useEffect(() => {
        if (
            fagsak.status === RessursStatus.SUKSESS &&
            klagebehandlinger.status === RessursStatus.IKKE_HENTET
        ) {
            hentKlagebehandlinger(fagsak.data.fagsakPersonId);
        }
    }, [fagsak, klagebehandlinger, hentKlagebehandlinger]);

    const leggTilNyBehandlingForOpprettelse = () => {
        settFeilmelding('');
        if (stønadstype) {
            settJournalføringsaksjon(Journalføringsaksjon.OPPRETT_BEHANDLING);
        } else {
            settFeilmelding('Velg stønadstype for å opprette ny behandling.');
        }
    };

    const skalOppretteNyBehandling =
        journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING;

    return (
        <DataViewer response={{ klagebehandlinger }}>
            {({ klagebehandlinger }) => {
                const valgtStønadstypeKey = stønadstypeTilKey(stønadstype);
                const klageBehandlinger = valgtStønadstypeKey
                    ? klagebehandlinger[valgtStønadstypeKey]
                    : [];
                const fagsakHarÅpenKlagebehandling =
                    valgtStønadstypeKey && harÅpenKlage(klagebehandlinger[valgtStønadstypeKey]);

                return (
                    <VStack gap="4">
                        <AlertInfo>
                            Merk at du ikke lenger trenger å knytte dokumenter til spesifikke
                            behandlinger da de automatisk knyttes til bruker. Du kan i listen under
                            få oversikt over tidligere behandlinger og vurdere om det skal opprettes
                            en ny behandling fra denne journalføringen.
                        </AlertInfo>
                        {fagsakHarÅpenKlagebehandling && (
                            <AlertInfo>
                                Merk at det allerede finnes en åpen fagsak på denne fagsaken
                            </AlertInfo>
                        )}
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
                                        <Table.DataCell>Klage</Table.DataCell>
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
                                {klageBehandlinger.map((behandling) => (
                                    <Table.Row key={behandling.id}>
                                        <Table.DataCell>Klage</Table.DataCell>
                                        <Table.DataCell>
                                            {KlagebehandlingStatusTilTekst[behandling.status]}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {formaterNullableIsoDato(behandling.vedtaksdato)}
                                        </Table.DataCell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        {klageBehandlinger.length === 0 && (
                            <TekstContainer>
                                <BodyShortItalic>
                                    Det finnes ingen behandlinger på denne fagsaken til brukeren. Du
                                    kan opprette en behandling eller journalføre på bruker uten
                                    behandling (lik generell sak i Gosys)
                                </BodyShortItalic>
                            </TekstContainer>
                        )}
                        <LeggTilKnapp
                            onClick={() => leggTilNyBehandlingForOpprettelse()}
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

export default Klagebehandlinger;
