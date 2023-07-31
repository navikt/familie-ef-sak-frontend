import { Cancel } from '@navikt/ds-icons';
import React from 'react';
import { Knapp } from './HovedKnapp';

const TilbakestillKnapp: React.FC<{
    onClick: () => void;
    knappetekst?: string;
    ikontekst?: string;
}> = ({ onClick, knappetekst, ikontekst }) => {
    return (
        <Knapp
            onClick={onClick}
            type="button"
            variant={knappetekst ? 'secondary' : 'tertiary'}
            icon={<Cancel title={knappetekst ? knappetekst : ikontekst} />}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Knapp>
    );
};

export default TilbakestillKnapp;
