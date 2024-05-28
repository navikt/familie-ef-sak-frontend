import { BodyShort } from '@navikt/ds-react';
import React from 'react';

interface SistePeriodeTittelTekstProps {
    tekst?: string;
    tittel?: string;
}

const SistePeriodeTittelTekst: React.FC<SistePeriodeTittelTekstProps> = ({
    tekst = 'Bruker har ingen stønadshistorikk i EF Sak',
    tittel = 'Siste periode med overgangsstønad',
}) => {
    return (
        <>
            <BodyShort size="medium" weight="semibold">
                {tittel}
            </BodyShort>
            <BodyShort>{tekst}</BodyShort>
        </>
    );
};

export default SistePeriodeTittelTekst;
