import React from 'react';
import styled from 'styled-components';
import { FamilieSelect, FamilieSelectProps } from './FamilieSelect';

const FamilieSelectMedFeilmeldingUtenPrikk = styled(FamilieSelect)`
    .navds-error-message::before {
        content: none;
    }
`;

export const EnsligFamilieSelect: React.FC<FamilieSelectProps> = (props) => (
    <FamilieSelectMedFeilmeldingUtenPrikk {...props} />
);
