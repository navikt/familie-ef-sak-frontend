import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    margin: 2rem;
    border-bottom: 3px solid #e9e7e7;
    min-width: 660px;

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
    children: {
        venstre: JSX.Element;
        høyre: JSX.Element;
    };
}

const ToKolonnerLayout: React.FC<Props> = ({ children: { venstre, høyre } }) => {
    return (
        <Container>
            <div className="leftContainer">{venstre}</div>
            <div className="rightContainer">{høyre}</div>
        </Container>
    );
};

export default ToKolonnerLayout;
