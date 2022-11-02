import { Systemtittel } from 'nav-frontend-typografi';
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
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { Button, Checkbox } from '@navikt/ds-react';
import { AddCircle } from '@navikt/ds-icons';

interface Props {
    settBehandling: (behandling?: BehandlingRequest) => void;
    behandling?: BehandlingRequest;
    fagsak: Ressurs<Fagsak>;
    settFeilmelding: Dispatch<SetStateAction<string>>;
}

interface INyBehandling {
    behandlingstype: Behandlingstype;
}

const StyledNyBehandlingRad = styled.tr`
    background-color: #cce1f3;
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
            const kanOppretteNyBehandling = fagsak.data.behandlinger.every(
                (behandling: Behandling) => behandling.status === BehandlingStatus.FERDIGSTILT
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
        <>
            <Systemtittel>Behandling</Systemtittel>
            <table className="tabell">
                <thead>
                    <tr>
                        <th></th>
                        <th>Behandlingstype</th>
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
                                        <td>{behandlingsEl.status}</td>
                                        <td>{formaterIsoDatoTid(behandlingsEl.sistEndret)}</td>
                                    </tr>
                                ))}
                                {nyBehandling && (
                                    <StyledNyBehandlingRad>
                                        <td>
                                            <Checkbox
                                                onChange={håndterCheck('ny')}
                                                checked={harValgtNyBehandling}
                                            >
                                                ny
                                            </Checkbox>
                                        </td>
                                        <td>{nyBehandling.behandlingstype}</td>
                                        <td>NY</td>
                                        <td>–</td>
                                    </StyledNyBehandlingRad>
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
        </>
    );
};

export default BehandlingInnold;
