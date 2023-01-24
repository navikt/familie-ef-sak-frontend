import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    padding: 1rem;

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
    children: {
        venstre: JSX.Element;
        høyre: JSX.Element;
    };
}

export const VilkårpanelInnhold: FC<Props> = ({ children: { venstre, høyre } }) => {
    return (
        <Container>
            <div className="venstreKolonne">{venstre}</div>
            <div className="høyreKolonne">{høyre}</div>
        </Container>
    );
};
