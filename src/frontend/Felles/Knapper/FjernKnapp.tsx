import { Delete } from '@navikt/ds-icons';
import React from 'react';
import hiddenIf from '../HiddenIf/hiddenIf';
import { Button } from '@navikt/ds-react';

const FjernKnapp: React.FC<{ onClick: () => void; knappetekst: string }> = ({
    onClick,
    knappetekst,
}) => {
    return (
        <Button
            onClick={onClick}
            type="button"
            variant={'tertiary'}
            icon={<Delete title={knappetekst} />}
        />
    );
};

export default hiddenIf(FjernKnapp);
