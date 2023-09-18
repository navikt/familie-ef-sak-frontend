import { ArrowDownIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Button } from '@navikt/ds-react';

const NedKnapp: React.FC<{ onClick: () => void; ikontekst: string }> = ({ onClick, ikontekst }) => {
    return (
        <Button
            type={'button'}
            onClick={onClick}
            variant={'tertiary'}
            icon={<ArrowDownIcon title={ikontekst} />}
        />
    );
};

export default NedKnapp;
