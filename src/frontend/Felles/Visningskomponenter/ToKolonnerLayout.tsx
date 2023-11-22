import React from 'react';
import styled from 'styled-components';

const Container = styled.div<{ $skillelinje?: boolean }>`
    display: flex;
    margin: 2rem;
    border-bottom: ${(props) => (props.$skillelinje ? '3px solid var(--a-border-subtle)' : 'none')};

    @media (max-width: 1600px) {
        flex-direction: column;
    }

    .venstreKolonne {
        padding: 1.5rem 0;
        width: 50%;

        @media (max-width: 1600px) {
            width: 100%;
        }
    }
    .høyreKolonne {
        padding: 1.5rem 0;
        width: 50%;
        max-width: 50rem;
        @media (max-width: 1600px) {
            width: 100%;
        }
    }
`;
interface Props {
    skillelinje?: boolean;
    children: {
        venstre: JSX.Element;
        høyre: JSX.Element;
    };
}

const ToKolonnerLayout: React.FC<Props> = ({
    skillelinje = true,
    children: { venstre, høyre },
}) => {
    return (
        <Container $skillelinje={skillelinje}>
            <div className="venstreKolonne">{venstre}</div>
            <div className="høyreKolonne">{høyre}</div>
        </Container>
    );
};

export default ToKolonnerLayout;
