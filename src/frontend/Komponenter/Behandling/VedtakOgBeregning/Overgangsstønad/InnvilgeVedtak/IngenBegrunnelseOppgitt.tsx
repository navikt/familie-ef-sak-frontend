import React from 'react';
import styled from 'styled-components';
import {
    BodyShortSmall,
    LabelSmallAsText,
} from '../../../../../Felles/Visningskomponenter/Tekster';

export const StyledDiv = styled.div`
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

export const IngenBegrunnelseOppgitt: React.FC = () => {
    return (
        <StyledDiv>
            <LabelSmallAsText className={'blokk-xxs'}>Begrunnelse</LabelSmallAsText>
            <BodyShortSmall style={{ fontStyle: 'italic' }}>
                Ingen opplysninger oppgitt.
            </BodyShortSmall>
        </StyledDiv>
    );
};
