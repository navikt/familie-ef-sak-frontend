import { AddCircle } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';
import hiddenIf from '../HiddenIf/hiddenIf';
import { Button } from '@navikt/ds-react';

export const KnappMedLuftUnder = styled(Button)`
    margin-bottom: 0.5rem;
`;

const LeggTilKnapp: React.FC<{ onClick: () => void; knappetekst?: string }> = ({
    onClick,
    knappetekst,
}) => {
    return (
        <KnappMedLuftUnder
            onClick={onClick}
            type="button"
            variant={knappetekst ? 'secondary' : 'tertiary'}
            icon={<AddCircle title={knappetekst} />}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </KnappMedLuftUnder>
    );
};

export default hiddenIf(LeggTilKnapp);
