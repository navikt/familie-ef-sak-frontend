import React from 'react';
import Rediger from '../Felles/Ikoner/Rediger';
import VisPdf from '../Felles/Ikoner/VisPdf';
import styled from 'styled-components';
import { Flatknapp } from 'nav-frontend-knapper';

const StyledFlatKnapp = styled(Flatknapp)`
    margin-right: 0.25rem;
`;

interface VisDokumentTittelProps {
    settDokumentForRedigering: () => void;
    hentDokument: () => void;
    dokumentTittel?: string;
}

const VisDokumentTittel: React.FC<VisDokumentTittelProps> = ({
    dokumentTittel,
    hentDokument,
    settDokumentForRedigering,
}) => {
    return (
        <>
            <span>{dokumentTittel}</span>
            <div>
                <StyledFlatKnapp kompakt={true} onClick={settDokumentForRedigering}>
                    <Rediger />
                </StyledFlatKnapp>
                <StyledFlatKnapp kompakt onClick={hentDokument}>
                    <VisPdf />
                </StyledFlatKnapp>
            </div>
        </>
    );
};

export default VisDokumentTittel;
