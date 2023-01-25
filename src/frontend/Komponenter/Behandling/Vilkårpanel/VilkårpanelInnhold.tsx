import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div<{ borderBottom: boolean }>`
    display: flex;
    margin: 0 1rem;
    border-bottom: ${(props) => (props.borderBottom ? '1px solid #d1d1d1' : 'none')};

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
        margin-left: auto;
        @media (max-width: 1600px) {
            width: 100%;
            margin-left: 0;
        }
    }
`;

interface Props {
    borderBottom?: boolean;
    children: {
        venstre?: JSX.Element;
        høyre: JSX.Element;
    };
}

export const VilkårpanelInnhold: FC<Props> = ({
    borderBottom = false,
    children: { venstre, høyre },
}) => {
    return (
        <Container borderBottom={borderBottom}>
            {venstre && <div className="venstreKolonne">{venstre}</div>}
            <div className="høyreKolonne">{høyre}</div>
        </Container>
    );
};
