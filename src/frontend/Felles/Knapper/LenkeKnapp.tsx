import * as React from 'react';
import hiddenIf from '../HiddenIf/hiddenIf';
import styled from 'styled-components';

const StyledKnapp = styled.button<{ minWidth?: string }>`
    min-width: ${(props) => (props.minWidth ? props.minWidth : '85')}px;
`;

interface IProps {
    onClick: () => void;
    minWidth?: string;
    children: React.ReactNode;
}

const LenkeKnapp: React.FC<IProps> = ({ onClick, children, minWidth }) => {
    return (
        <StyledKnapp className="lenke" onClick={onClick} minWidth={minWidth}>
            <>{children}</>
        </StyledKnapp>
    );
};

export default hiddenIf(LenkeKnapp);
