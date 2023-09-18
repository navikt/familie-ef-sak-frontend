import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import 'nav-frontend-tabell-style';
import styled from 'styled-components';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { formaterIsoDatoTid, formaterNullableIsoDato } from '../../App/utils/formatter';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { KlageBehandling, Klagebehandlinger } from '../../App/typer/klage';
import { BehandlingKlageRequest } from '../../App/hooks/useJournalføringKlageState';
import { Alert, Button, Checkbox, Heading } from '@navikt/ds-react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { harÅpenKlage } from '../../App/utils/klage';

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
        if (valgtFagsak) {
            settNyBehandling(true);
        } else {
            settFeilmelding('Velg stønadstype for å opprette ny behandling');
        }
    };

    const visÅpenKlageVarsel =
        behandlinger.status === RessursStatus.SUKSESS &&
        valgtFagsak &&
        harÅpenKlage(behandlinger.data[valgtFagsak]);

    return (
        <>
            <Heading size={'medium'} level={'2'}>
                Behandling
            </Heading>
            {visÅpenKlageVarsel && (
                <Alert variant={'info'}>
                    Merk at det allerede finnes en åpen klage på denne fagsaken
                </Alert>
            )}
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
                                                        hideLabel={true}
                                                    >
                                                        {behandlingsEl.status}
                                                    </Checkbox>
                                                </td>
                                                <td>Klage</td>
                                                <td>
                                                    {formaterIsoDatoTid(behandlingsEl.opprettet)}
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
                                                hideLabel={true}
                                            >
                                                Ny
                                            </Checkbox>
                                        </td>
                                        <td>Klage</td>
                                        <td>NY</td>
                                        <td>–</td>
                                    </StyledNyBehandlingRad>
                                )}
                            </>
                        )}
                    </DataViewer>
                </tbody>
            </table>
            {!nyBehandling && !behandling?.behandlingId && (
                <Button
                    variant={'tertiary'}
                    type={'button'}
                    onClick={lagNyBehandlingRad}
                    icon={<PlusCircleIcon />}
                >
                    <span>Opprett ny behandling</span>
                </Button>
            )}
        </>
    );
};

export default BehandlingKlageInnold;
