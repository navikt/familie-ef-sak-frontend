import { ArrowUndoIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Button } from '@navikt/ds-react';

const TilbakestillKnapp: React.FC<{
    onClick: () => void;
    knappetekst?: string;
    ikontekst?: string;
}> = ({ onClick, knappetekst, ikontekst }) => {
    return (
        <Button
            onClick={onClick}
            type="button"
            variant={knappetekst ? 'secondary' : 'tertiary'}
            icon={<ArrowUndoIcon title={knappetekst ? knappetekst : ikontekst} />}
            style={{ width: 'fit-content' }}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Button>
    );
};

export default TilbakestillKnapp;
