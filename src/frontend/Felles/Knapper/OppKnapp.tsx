import { Up } from '@navikt/ds-icons';
import React from 'react';
import { Button } from '@navikt/ds-react';

const OppKnapp: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <Button
            type={'button'}
            onClick={onClick}
            variant={'tertiary'}
            icon={<Up title={'opp pil'} />}
        />
    );
};

export default OppKnapp;
