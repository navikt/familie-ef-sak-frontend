import * as React from 'react';
import { useEffect, useState } from 'react';
import Dokumentoversikt from './Dokumentoversikt';
import Valgvisning from './Valgvisning';
import styled from 'styled-components';
import BehandlingHistorikk from './BehandlingHistorikk';
import Totrinnskontroll from '../Totrinnskontroll/Totrinnskontroll';
import { Back, Next } from '@navikt/ds-icons';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { erBehandlingUnderArbeid } from '../../../App/typer/behandlingstatus';
import { ABlue400 } from '@navikt/ds-tokens/dist/tokens';
import { Behandling } from '../../../App/typer/fagsak';

interface Props {
    behandling: Behandling;
    åpenHøyremeny: boolean;
}

const StyledBack = styled(Back)`
    border-radius: 0;
    margin-top: 3px;
    margin-right: 2px;
    color: white;
`;

const StyledNext = styled(Next)`
    border-radius: 0;
    margin-top: 3px;
    color: white;
`;

const StyledButton = styled.button`
    position: absolute;

    background-color: ${ABlue400};

    margin-left: -12px;

    z-index: 22;

    top: 200px;

    width: 24px;
    height: 24px;

    border-radius: 50%;

    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const StyledHøyremeny = styled.div`
    width: 100%;
`;

export enum Høyremenyvalg {
    Mappe = 'Mappe',
    Dialog = 'Dialog',
    Logg = 'Logg',
}

const Høyremeny: React.FC<Props> = ({ behandling, åpenHøyremeny }) => {
    const [aktivtValg, settAktivtvalg] = useState<Høyremenyvalg>(Høyremenyvalg.Logg);
    const { settÅpenHøyremeny } = useBehandling();

    useEffect(() => {
        if (erBehandlingUnderArbeid(behandling)) {
            settAktivtvalg(Høyremenyvalg.Mappe);
        }
    }, [behandling]);

    return (
        <>
            {åpenHøyremeny ? (
                <>
                    <Totrinnskontroll />
                    <StyledHøyremeny>
                        <StyledButton
                            onClick={() => {
                                settÅpenHøyremeny(!åpenHøyremeny);
                            }}
                        >
                            <StyledNext />
                        </StyledButton>
                        <Valgvisning aktiv={aktivtValg} settAktiv={settAktivtvalg} />
                        {aktivtValg === Høyremenyvalg.Mappe && <Dokumentoversikt />}
                        {aktivtValg === Høyremenyvalg.Logg && (
                            <BehandlingHistorikk
                                behandling={behandling}
                                behandlingId={behandling.id}
                            />
                        )}
                        {aktivtValg === Høyremenyvalg.Dialog && <div>Her kommer dialog</div>}
                    </StyledHøyremeny>
                </>
            ) : (
                <StyledButton
                    onClick={() => {
                        settÅpenHøyremeny(!åpenHøyremeny);
                    }}
                >
                    <StyledBack />
                </StyledButton>
            )}
        </>
    );
};

export default Høyremeny;
