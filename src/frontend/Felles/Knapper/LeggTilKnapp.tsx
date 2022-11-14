import { AddCircle } from '@navikt/ds-icons';
import React from 'react';
import hiddenIf from '../HiddenIf/hiddenIf';
import { Button } from '@navikt/ds-react';

const LeggTilKnapp: React.FC<{ onClick: () => void; knappetekst?: string }> = ({
    onClick,
    knappetekst,
}) => {
    return (
        <Button
            onClick={onClick}
            type="button"
            variant={knappetekst ? 'secondary' : 'tertiary'}
            icon={<AddCircle title={knappetekst} />}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Button>
    );
};

export default hiddenIf(LeggTilKnapp);
