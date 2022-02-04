import * as React from 'react';
import { useState } from 'react';
import Dokumentoversikt from './Dokumentoversikt';
import Valgvisning from './Valgvisning';
import styled from 'styled-components';
import BehandlingHistorikk from './BehandlingHistorikk';
import Totrinnskontroll from '../Totrinnskontroll/Totrinnskontroll';

interface IHøyremenyProps {
    behandlingId: string;
}

const StyledHøyremeny = styled.div`
    width: 100%;
`;

export enum Høyremenyvalg {
    Mappe = 'Mappe',
    Dialog = 'Dialog',
    Logg = 'Logg',
}

const Høyremeny: React.FC<IHøyremenyProps> = ({ behandlingId }) => {
    const [aktivtValg, settAktivtvalg] = useState<Høyremenyvalg>(Høyremenyvalg.Logg);
    return (
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
    );
};

export default Høyremeny;
