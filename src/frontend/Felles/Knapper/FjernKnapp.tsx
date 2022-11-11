import { Delete } from '@navikt/ds-icons';
import React from 'react';
import hiddenIf from '../HiddenIf/hiddenIf';
import { Button } from '@navikt/ds-react';
import styled from 'styled-components';

const KnappMedLuftUnder = styled(Button)`
    margin-bottom: 0.5rem;
`;
const FjernKnapp: React.FC<{ onClick: () => void; knappetekst: string }> = ({
    onClick,
    knappetekst,
}) => {
    return (
        <KnappMedLuftUnder
            onClick={onClick}
            type="button"
            variant={'tertiary'}
            icon={
                <Delete>
                    <span className="sr-only" hidden>
                        {knappetekst}
                    </span>
                </Delete>
            }
        />
    );
};

export default hiddenIf(FjernKnapp);
