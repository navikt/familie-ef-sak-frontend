import { ArrowUpIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Button } from '@navikt/ds-react';

const OppKnapp: React.FC<{ onClick: () => void; ikontekst: string }> = ({ onClick, ikontekst }) => {
    return (
        <Button
            type={'button'}
            onClick={onClick}
            variant={'tertiary'}
            icon={<ArrowUpIcon title={ikontekst} />}
        />
    );
};

export default OppKnapp;
