import React from 'react';
import { Button } from '@navikt/ds-react';
import { Down, Up } from '@navikt/ds-icons';
import styled from 'styled-components';

export interface UtvidPanelProps {
    children: React.ReactNode;
    intro?: React.ReactNode;
    knappTekst: string;
    åpen: boolean;
    onClick: () => void;
    position?: 'left' | 'right' | 'center';
}

const StyledUtvidPanel = styled.div<{ position?: string }>`
    display: flex;
    justify-content: ${(props) => props.position || 'center'};
`;

const UtvidPanel: React.FC<UtvidPanelProps> = ({
    onClick,
    children,
    intro,
    knappTekst,
    åpen,
    position,
}) => {
    return (
        <div>
            <>{intro}</>
            {åpen && <>{children}</>}
            <StyledUtvidPanel position={position}>
                <Button
                    size={'small'}
                    variant={'tertiary'}
                    onClick={onClick}
                    icon={åpen ? <Up /> : <Down />}
                >
                    {knappTekst}
                </Button>
            </StyledUtvidPanel>
        </div>
    );
};

export default UtvidPanel;
