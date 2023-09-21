import React from 'react';
import styled from 'styled-components';
import { BodyShortSmall, SmallTextLabel } from '../../../../../Felles/Visningskomponenter/Tekster';

export const StyledDiv = styled.div`
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

const SmallTextLabelMedMargin = styled(SmallTextLabel)`
    margin-bottom: 0.5rem;
`;

export const IngenBegrunnelseOppgitt: React.FC = () => {
    return (
        <StyledDiv>
            <SmallTextLabelMedMargin>Begrunnelse</SmallTextLabelMedMargin>
            <BodyShortSmall style={{ fontStyle: 'italic' }}>
                Ingen opplysninger oppgitt.
            </BodyShortSmall>
        </StyledDiv>
    );
};
