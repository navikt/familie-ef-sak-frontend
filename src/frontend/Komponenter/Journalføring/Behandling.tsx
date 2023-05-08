import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import 'nav-frontend-tabell-style';
import styled from 'styled-components';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { Behandling, Fagsak } from '../../App/typer/fagsak';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { BehandlingRequest } from '../../App/hooks/useJournalføringState';
import { formaterIsoDatoTid } from '../../App/utils/formatter';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { Behandlingsårsak } from '../../App/typer/Behandlingsårsak';
import { utledRiktigBehandlingstype } from './journalførBehandlingUtil';
import { Button, Checkbox, Heading } from '@navikt/ds-react';
import { AddCircle } from '@navikt/ds-icons';
import { alleBehandlingerErFerdigstiltEllerSattPåVent } from '../Personoversikt/utils';

interface Props {
    settBehandling: (behandling?: BehandlingRequest) => void;
    behandling?: BehandlingRequest;
    fagsak: Ressurs<Fagsak>;
    settFeilmelding: Dispatch<SetStateAction<string>>;
}

interface INyBehandling {
    behandlingstype: Behandlingstype;
}

const TableRow = styled.tr`
    background-color: #cce1f3;
`;

const Container = styled.div`
    margin-top: 1rem;
`;

const BehandlingInnold: React.FC<Props> = ({
    behandling,
    settBehandling,
    fagsak,
    settFeilmelding,
}) => {
    const [nyBehandling, settNyBehandling] = useState<INyBehandling>();
    const [harValgtNyBehandling, settHarValgtNyBehandling] = useState<boolean>(false);

    useEffect(() => {
        settNyBehandling(undefined);
        settHarValgtNyBehandling(false);
    }, [fagsak]);

    const håndterCheck = (behandlingsId: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                if (behandlingsId === 'ny') {
                    settBehandling({
                        behandlingstype: nyBehandling?.behandlingstype,
                    });
                    settHarValgtNyBehandling(true);
                } else {
                    settBehandling({
                        behandlingsId,
                    });
                    settHarValgtNyBehandling(false);
                }
            } else {
                settBehandling(undefined);
                settHarValgtNyBehandling(false);
            }
        };
    };

    const lagNyBehandlingRad = () => {
        settFeilmelding('');
        if (fagsak.status === RessursStatus.SUKSESS) {
            const kanOppretteNyBehandling = alleBehandlingerErFerdigstiltEllerSattPåVent(
                fagsak.data
            );

            if (kanOppretteNyBehandling) {
                settNyBehandling({
                    behandlingstype: utledRiktigBehandlingstype(fagsak.data.behandlinger),
                });
            } else {
                settFeilmelding(
                    'Kan ikke opprette ny behandling på fagsak med en behandling som ikke er ferdigstilt'
                );
            }
        } else {
            settFeilmelding('Velg stønadstype for å opprette ny behandling');
        }
    };

    return (
        <Container>
            <Heading size={'medium'} level={'2'}>
                Behandling
            </Heading>
            <table className="tabell">
                <thead>
                    <tr>
                        <th></th>
                        <th>Behandlingstype</th>
                        <th>Opprettet</th>
                        <th>Status</th>
                        <th>Sist endret</th>
                    </tr>
                </thead>
                <tbody>
                    <DataViewer response={{ fagsak }}>
                        {({ fagsak }) => (
                            <>
                                {fagsak.behandlinger.map((behandlingsEl: Behandling) => (
                                    <tr key={behandlingsEl.id}>
                                        <td>
                                            <Checkbox
                                                onChange={håndterCheck(behandlingsEl.id)}
                                                checked={
                                                    behandlingsEl.id === behandling?.behandlingsId
                                                }
                                                hideLabel={true}
                                            >
                                                {behandlingsEl.type}
                                            </Checkbox>
                                        </td>
                                        <td>
                                            {behandlingsEl.behandlingsårsak ===
                                            Behandlingsårsak.MIGRERING
                                                ? Behandlingsårsak.MIGRERING
                                                : behandlingsEl.type}
                                        </td>
                                        <td>{formaterIsoDatoTid(behandlingsEl.opprettet)}</td>
                                        <td>{behandlingsEl.status}</td>
                                        <td>{formaterIsoDatoTid(behandlingsEl.sistEndret)}</td>
                                    </tr>
                                ))}
                                {nyBehandling && (
                                    <TableRow>
                                        <td>
                                            <Checkbox
                                                onChange={håndterCheck('ny')}
                                                checked={harValgtNyBehandling}
                                                hideLabel={true}
                                            >
                                                ny
                                            </Checkbox>
                                        </td>
                                        <td>{nyBehandling.behandlingstype}</td>
                                        <td>NY</td>
                                        <td>–</td>
                                    </TableRow>
                                )}
                            </>
                        )}
                    </DataViewer>
                </tbody>
            </table>
            {!nyBehandling && !behandling?.behandlingsId && (
                <Button
                    variant={'tertiary'}
                    type={'button'}
                    onClick={lagNyBehandlingRad}
                    icon={<AddCircle />}
                >
                    <span>Opprett ny behandling</span>
                </Button>
            )}
        </Container>
    );
};

export default BehandlingInnold;
