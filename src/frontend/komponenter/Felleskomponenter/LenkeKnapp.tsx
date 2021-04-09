import * as React from 'react';
import hiddenIf from './HiddenIf/hiddenIf';
import styled from 'styled-components';

const StyledKnapp = styled.button`
    min-width: 85px;
`;

const LenkeKnapp: React.FC<{ onClick: () => void }> = ({ onClick, children }) => {
    return (
        <StyledKnapp className="lenke" onClick={onClick}>
            <>{children}</>
        </StyledKnapp>
    );
};

export default hiddenIf(LenkeKnapp);
