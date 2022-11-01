import { Systemtittel } from 'nav-frontend-typografi';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import 'nav-frontend-tabell-style';
import { Checkbox } from 'nav-frontend-skjema';
import { Flatknapp } from 'nav-frontend-knapper';
import LeggtilMedSirkel from '../../Felles/Ikoner/LeggtilMedSirkel';
import styled from 'styled-components';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { KlageBehandling, Klagebehandlinger, KlagebehandlingStatus } from '../../App/typer/klage';
import { BehandlingKlageRequest } from '../../App/hooks/useJournalføringKlageState';

interface Props {
    settBehandling: (behandling?: BehandlingKlageRequest) => void;
    behandling?: BehandlingKlageRequest;
    behandlinger: Ressurs<Klagebehandlinger>;
    valgtFagsak?: keyof Klagebehandlinger;
    settFeilmelding: Dispatch<SetStateAction<string>>;
}

const StyledNyBehandlingRad = styled.tr`
    background-color: #cce1f3;
`;

const BehandlingKlageInnold: React.FC<Props> = ({
    behandling,
    settBehandling,
    behandlinger,
    valgtFagsak,
    settFeilmelding,
}) => {
    const [nyBehandling, settNyBehandling] = useState<boolean>(false);
    const [harValgtNyBehandling, settHarValgtNyBehandling] = useState<boolean>(false);

    useEffect(() => {
        settBehandling(undefined);
        settHarValgtNyBehandling(false);
    }, [behandlinger, settBehandling]);

    const håndterCheck = (behandlingId: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                if (behandlingId === 'ny') {
                    settBehandling({});
                    settHarValgtNyBehandling(true);
                } else {
                    settBehandling({ behandlingId });
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
        if (behandlinger.status === RessursStatus.SUKSESS && valgtFagsak) {
            const kanOppretteNyBehandling = behandlinger.data[valgtFagsak].every(
                (behandling: KlageBehandling) =>
                    behandling.status === KlagebehandlingStatus.FERDIGSTILT
            );

            if (kanOppretteNyBehandling) {
                settNyBehandling(true);
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
                        <th>Status</th>
                        <th>Sist endret</th>
                    </tr>
                </thead>
                <tbody>
                    <DataViewer response={{ behandlinger }}>
                        {({ behandlinger }) => (
                            <>
                                {valgtFagsak &&
                                    behandlinger[valgtFagsak].map(
                                        (behandlingsEl: KlageBehandling) => (
                                            <tr key={behandlingsEl.id}>
                                                <td>
                                                    <Checkbox
                                                        onChange={håndterCheck(behandlingsEl.id)}
                                                        checked={
                                                            behandlingsEl.id ===
                                                            behandling?.behandlingId
                                                        }
                                                        label={behandlingsEl.status}
                                                    />
                                                </td>
                                                <td>{behandlingsEl.status}</td>
                                                <td>
                                                    {formaterNullableIsoDato(
                                                        behandlingsEl.vedtaksdato
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                {nyBehandling && (
                                    <StyledNyBehandlingRad>
                                        <td>
                                            <Checkbox
                                                onChange={håndterCheck('ny')}
                                                checked={harValgtNyBehandling}
                                                label={'ny'}
                                            />
                                        </td>
                                        <td>NY</td>
                                        <td>–</td>
                                    </StyledNyBehandlingRad>
                                )}
                            </>
                        )}
                    </DataViewer>
                </tbody>
            </table>
            {!behandling?.behandlingId && (
                <Flatknapp onClick={lagNyBehandlingRad}>
                    <LeggtilMedSirkel />
                    <span>Opprett ny behandling</span>
                </Flatknapp>
            )}
        </>
    );
};

export default BehandlingKlageInnold;
