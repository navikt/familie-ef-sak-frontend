import { AddCircle } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';
import { Flatknapp } from 'nav-frontend-knapper';
import hiddenIf from '../HiddenIf/hiddenIf';

const KnappMedLuftUnder = styled(Flatknapp)`
    padding: 0;
    margin-bottom: 1rem;
`;

const LeggTilKnapp: React.FC<{ onClick: () => void; knappetekst: string }> = ({
    onClick,
    knappetekst,
}) => {
    return (
        <KnappMedLuftUnder onClick={onClick} htmlType="button">
            <AddCircle style={{ marginRight: '1rem' }} />
            {knappetekst}
        </KnappMedLuftUnder>
    );
};

export default hiddenIf(LeggTilKnapp);
