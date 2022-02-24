import * as React from 'react';
import { useState, Dispatch, SetStateAction } from 'react';
import Dokumentoversikt from './Dokumentoversikt';
import Valgvisning from './Valgvisning';
import styled from 'styled-components';
import BehandlingHistorikk from './BehandlingHistorikk';
import Totrinnskontroll from '../Totrinnskontroll/Totrinnskontroll';
import { Back } from '@navikt/ds-icons';

interface IHøyremenyProps {
    behandlingId: string;
    åpenHøyremeny: boolean;
    settÅpenHøyremeny: Dispatch<SetStateAction<boolean>>;
}

const StyledBack = styled(Back)`
    border-radius: 0;
    margin-top: 3px;
    margin-right: 2px;
    color: white;
`;

const StyledButton = styled.button`
    position: absolute;

    background-color: #3386e0;

    right: 12px;
    top: 200px;

    width: 24px;
    height: 24px;

    z-index: 10000;
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

const Høyremeny: React.FC<IHøyremenyProps> = ({
    behandlingId,
    åpenHøyremeny,
    settÅpenHøyremeny,
}) => {
    const [aktivtValg, settAktivtvalg] = useState<Høyremenyvalg>(Høyremenyvalg.Logg);
    return (
        <>
            {åpenHøyremeny ? (
                <>
                    <Totrinnskontroll />
                    <StyledHøyremeny>
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
