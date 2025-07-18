import * as React from 'react';
import { useEffect, useState } from 'react';
import { Dokumentoversikt } from './Dokumentoversikt/Dokumentoversikt';
import Valgvisning from './Valgvisning';
import styled from 'styled-components';
import BehandlingHistorikk from './BehandlingHistorikk';
import Totrinnskontroll from '../Totrinnskontroll/Totrinnskontroll';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { erBehandlingUnderArbeid } from '../../../App/typer/behandlingstatus';
import { ABlue400 } from '@navikt/ds-tokens/dist/tokens';
import { Behandling } from '../../../App/typer/fagsak';
import TilegnetSaksbehandler from './TilegnetSaksbehandler';
import TildelOppgave from './TildelOppgave';
import styles from './Høyremeny.module.css';

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

interface Props {
    behandling: Behandling;
    åpenHøyremeny: boolean;
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
                    <TildelOppgave behandling={behandling} />
                    <Totrinnskontroll />
                    <StyledHøyremeny>
                        <StyledButton
                            className={styles.hoyreMenybutton}
                            onClick={() => {
                                settÅpenHøyremeny(!åpenHøyremeny);
                            }}
                        >
                            <StyledNext />
                        </StyledButton>
                        <TilegnetSaksbehandler behandling={behandling} />
                        <Valgvisning aktiv={aktivtValg} settAktiv={settAktivtvalg} />
                        {aktivtValg === Høyremenyvalg.Mappe && <Dokumentoversikt />}
                        {aktivtValg === Høyremenyvalg.Logg && (
                            <BehandlingHistorikk behandling={behandling} />
                        )}
                        {aktivtValg === Høyremenyvalg.Dialog && <div>Her kommer dialog</div>}
                    </StyledHøyremeny>
                </>
            ) : (
                <StyledButton
                    onClick={() => {
                        settÅpenHøyremeny(!åpenHøyremeny);
                    }}
                    className={styles.hoyreMenybutton}
                >
                    <StyledBack />
                </StyledButton>
            )}
        </>
    );
};

export default Høyremeny;
