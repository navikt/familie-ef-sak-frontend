import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';

interface SistePeriodeTittelTekstProps {
    tekst?: string;
    tittel?: string;
}

const Container = styled.div`
    & > *:not(:last-child) {
        margin-bottom: 0.75rem;
    }
`;

const SistePeriodeTittelTekst: React.FC<SistePeriodeTittelTekstProps> = ({
    tekst = 'Bruker har ingen stønadshistorikk i EF Sak',
    tittel = 'Siste periode med overgangsstønad',
}) => {
    return (
        <Container>
            <Label size="small" className="tittel" as="h3">
                {tittel}
            </Label>
            <BodyShort size="small">{tekst}</BodyShort>
        </Container>
    );
};

export default SistePeriodeTittelTekst;
