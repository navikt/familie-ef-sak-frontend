import { Systemtittel } from 'nav-frontend-typografi';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import 'nav-frontend-tabell-style';
import { Checkbox } from 'nav-frontend-skjema';
import { Flatknapp } from 'nav-frontend-knapper';
import LeggtilMedSirkel from '../../Felles/Ikoner/LeggtilMedSirkel';
import styled from 'styled-components';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { Behandling, Fagsak } from '../../App/typer/fagsak';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { BehandlingRequest } from '../../App/hooks/useJournalføringState';
import { formaterIsoDatoTid } from '../../App/utils/formatter';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { Behandlingsårsak } from '../../App/typer/Behandlingsårsak';
import { utledRiktigBehandlingstype } from './journalførBehandlingUtil';

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
                (behandling: Behandling) => behandling.status !== 'UTREDES'
            );

            if (kanOppretteNyBehandling) {
                settNyBehandling({
                    behandlingstype: utledRiktigBehandlingstype(fagsak.data.behandlinger),
                });
            } else {
                settFeilmelding(
                    'Kan ikke opprette ny behandling på fagsak med eksisterende behandling med status UTREDES'
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
                                                label={behandlingsEl.type}
                                            />
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
                                                label={'ny'}
                                            />
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
            {!nyBehandling && (
                <Flatknapp onClick={lagNyBehandlingRad}>
                    <LeggtilMedSirkel />
                    <span>Opprett ny behandling</span>
                </Flatknapp>
            )}
        </>
    );
};

export default BehandlingInnold;
