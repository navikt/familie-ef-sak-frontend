import { Down } from '@navikt/ds-icons';
import React from 'react';
import { Button } from '@navikt/ds-react';

const NedKnapp: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <Button
            type={'button'}
            onClick={onClick}
            variant={'tertiary'}
            icon={<Down title={'ned pil'} />}
        />
    );
};

export default NedKnapp;
