import React from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';
import styled from 'styled-components';

const Tittel = styled(Heading)`
    text-decoration: underline;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--ax-bg-success-soft);
    padding: 1rem;
    border: 1px solid var(--ax-neutral-500);
    border-radius: 6px;
    text-align: left;
`;

const HistorikkIInfotrygdKort: React.FC = () => {
    return (
        <Container>
            <Tittel level="3" size="small">
                Historikk i Infotrygd
            </Tittel>
            <BodyShort size="small">
                Bruker har historikk i Infotrygd som må sjekkes manuelt.
            </BodyShort>
        </Container>
    );
};

export default HistorikkIInfotrygdKort;
