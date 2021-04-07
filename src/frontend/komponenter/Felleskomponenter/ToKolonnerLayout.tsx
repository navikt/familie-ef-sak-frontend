import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    margin: 2rem;
    border-bottom: ${(props: { skillelinje: boolean }) =>
        props.skillelinje ? '3px solid #e9e7e7' : 'none'};

    .venstreKolonne {
        padding: 1.5rem 0;
        width: 50%;
    }
    .høyreKolonne {
        padding: 1.5rem 0;
        width: 50%;
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
        <Container skillelinje={skillelinje}>
            <div className="venstreKolonne">{venstre}</div>
            <div className="høyreKolonne">{høyre}</div>
        </Container>
    );
};

export default ToKolonnerLayout;
