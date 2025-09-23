import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';

export const KnappNullstillSkjema: React.FC<{
    nullstillSkjema: () => void;
}> = ({ nullstillSkjema: nullstillSkjema }) => {
    return (
        <div>
            <Button
                onClick={nullstillSkjema}
                icon={<TrashIcon title="Nullstill skjema" fontSize="1.5rem" />}
            />
        </div>
    );
};
