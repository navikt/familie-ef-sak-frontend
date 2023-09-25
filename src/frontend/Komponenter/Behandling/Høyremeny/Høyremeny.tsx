import * as React from 'react';
import { useEffect, useState } from 'react';
import Dokumentoversikt from './Dokumentoversikt';
import Valgvisning from './Valgvisning';
import styled from 'styled-components';
import BehandlingHistorikk from './BehandlingHistorikk';
import Totrinnskontroll from '../Totrinnskontroll/Totrinnskontroll';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursStatus } from '../../../App/typer/ressurs';
import { erBehandlingUnderArbeid } from '../../../App/typer/behandlingstatus';
import { ABlue400 } from '@navikt/ds-tokens/dist/tokens';

interface IHøyremenyProps {
    behandlingId: string;
    åpenHøyremeny: boolean;
}

const StyledBack = styled(ChevronLeftIcon)`
    border-radius: 0;
    margin-top: 3px;
    margin-right: 2px;
    color: white;
`;

const StyledNext = styled(ChevronRightIcon)`
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

const Høyremeny: React.FC<IHøyremenyProps> = ({ behandlingId, åpenHøyremeny }) => {
    const [aktivtValg, settAktivtvalg] = useState<Høyremenyvalg>(Høyremenyvalg.Logg);
    const { settÅpenHøyremeny, behandling } = useBehandling();

    useEffect(() => {
        if (
            behandling.status === RessursStatus.SUKSESS &&
            erBehandlingUnderArbeid(behandling.data)
        ) {
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
                            <BehandlingHistorikk behandlingId={behandlingId} />
                        )}
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
