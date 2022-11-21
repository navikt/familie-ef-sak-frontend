import { Down } from '@navikt/ds-icons';
import React from 'react';
import { Button } from '@navikt/ds-react';

const NedKnapp: React.FC<{ onClick: () => void; ikontekst: string }> = ({ onClick, ikontekst }) => {
    return (
        <Button
            type={'button'}
            onClick={onClick}
            variant={'tertiary'}
            icon={<Down title={ikontekst} />}
        />
    );
};

export default NedKnapp;
