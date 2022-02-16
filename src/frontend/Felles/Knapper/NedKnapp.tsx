import { DownFilled } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';
import { Flatknapp } from 'nav-frontend-knapper';
import hiddenIf from '../HiddenIf/hiddenIf';

const KnappMedLuftUnder = styled(Flatknapp)`
    padding: 0;
    margin-bottom: 1rem;
`;

const NedKnapp: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <KnappMedLuftUnder onClick={onClick} htmlType="button">
            <DownFilled style={{ marginLeft: '1rem', marginRight: '1rem' }} />
        </KnappMedLuftUnder>
    );
};

export default hiddenIf(NedKnapp);
