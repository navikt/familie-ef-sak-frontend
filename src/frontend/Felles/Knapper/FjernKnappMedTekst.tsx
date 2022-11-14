import { Delete } from '@navikt/ds-icons';
import React from 'react';
import hiddenIf from '../HiddenIf/hiddenIf';
import { Button } from '@navikt/ds-react';

const FjernKnappMedTekst: React.FC<{ onClick: () => void; knappetekst: string }> = ({
    onClick,
    knappetekst,
}) => {
    return (
        <Button
            onClick={onClick}
            type="button"
            variant={'secondary'}
            icon={<Delete title={knappetekst} />}
        >
            <span>{knappetekst}</span>
        </Button>
    );
};

export default hiddenIf(FjernKnappMedTekst);
