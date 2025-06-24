import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { AGray300 } from '@navikt/ds-tokens/dist/tokens';
import { Box } from '@navikt/ds-react';

const Container = styled.div<{ $borderBottom: boolean }>`
    display: flex;
    border-bottom: ${(props) => (props.$borderBottom ? `1px solid ${AGray300}` : 'none')};

    @media (max-width: 1600px) {
        flex-direction: column;
    }

    .venstreKolonne {
        width: 50%;

        @media (max-width: 1600px) {
            width: 100%;
        }
    }
    .høyreKolonne {
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
        venstre?: ReactNode;
        høyre: ReactNode;
    };
}

export const VilkårpanelInnhold: FC<Props> = ({
    borderBottom = false,
    children: { venstre, høyre },
}) => {
    return (
        <Box padding={'space-16'}>
            <Container $borderBottom={borderBottom}>
                {venstre && <div className="venstreKolonne">{venstre}</div>}
                <div className="høyreKolonne">{høyre}</div>
            </Container>
        </Box>
    );
};
