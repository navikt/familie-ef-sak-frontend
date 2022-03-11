import * as React from 'react';
import { useState } from 'react';
import Dokumentoversikt from './Dokumentoversikt';
import Valgvisning from './Valgvisning';
import styled from 'styled-components';
import BehandlingHistorikk from './BehandlingHistorikk';
import Totrinnskontroll from '../Totrinnskontroll/Totrinnskontroll';
import { Back, Next } from '@navikt/ds-icons';
import navFarger from 'nav-frontend-core';
import { useBehandling } from '../../../App/context/BehandlingContext';

interface IHøyremenyProps {
    behandlingId: string;
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

    background-color: ${navFarger.navBlaLighten20};

    margin-left: -12px;

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

const Høyremeny: React.FC<IHøyremenyProps> = ({ behandlingId, åpenHøyremeny }) => {
    const [aktivtValg, settAktivtvalg] = useState<Høyremenyvalg>(Høyremenyvalg.Logg);
    const { settÅpenHøyremeny } = useBehandling();

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
                        <Dokumentoversikt hidden={aktivtValg !== Høyremenyvalg.Mappe} />
                        <BehandlingHistorikk
                            hidden={aktivtValg !== Høyremenyvalg.Logg}
                            behandlingId={behandlingId}
                        />
                        {aktivtValg === Høyremenyvalg.Dialog && <div>Her kommer dialog</div>}
                    </StyledHøyremeny>
                </>
            ) : (
                <div>
                    <StyledButton
                        onClick={() => {
                            settÅpenHøyremeny(!åpenHøyremeny);
                        }}
                    >
                        <StyledBack />
                    </StyledButton>
                </div>
            )}
        </>
    );
};

export default Høyremeny;
