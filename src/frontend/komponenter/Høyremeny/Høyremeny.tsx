import * as React from 'react';
import { useState } from 'react';
import Dokumentoversikt from './Dokumentoversikt';
import Valgvisning from './Valgvisning';
import styled from 'styled-components';
import BehandlingHistorikk from './BehandlingHistorikk';
import Totrinnskontroll from '../Behandling/Totrinnskontroll/Totrinnskontroll';

const StyledHøyremeny = styled.div`
    width: 300px;
`;

export enum Høyremenyvalg {
    Mappe = 'Mappe',
    Dialog = 'Dialog',
    Logg = 'Logg',
}

const Høyremeny: React.FC = () => {
    const [aktivtValg, settAktivtvalg] = useState<Høyremenyvalg>(Høyremenyvalg.Mappe);
    return (
        <>
            <Totrinnskontroll />
            <StyledHøyremeny>
                <Valgvisning aktiv={aktivtValg} settAktiv={settAktivtvalg} />
                <Dokumentoversikt hidden={aktivtValg !== Høyremenyvalg.Mappe} />
                <BehandlingHistorikk hidden={aktivtValg !== Høyremenyvalg.Logg} />
                {aktivtValg === Høyremenyvalg.Dialog && <div>Her kommer dialog</div>}
            </StyledHøyremeny>
        </>
    );
};

export default Høyremeny;
