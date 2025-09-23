import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';

export const KnappNullstillSkjema: React.FC<{
    resetBeregninggskjema: () => void;
}> = ({ resetBeregninggskjema }) => {
    return (
        <div>
            <Button
                onClick={resetBeregninggskjema}
                icon={<TrashIcon title="Nullstill skjema" fontSize="1.5rem" />}
            />
        </div>
    );
};
