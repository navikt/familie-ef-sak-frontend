import * as React from 'react';

import { CogRotationIcon } from '@navikt/aksel-icons';

import { TidslinjeIkonbakgrunn } from './ikonelementer';

const SystemIkon: React.FC = () => {
    return (
        <TidslinjeIkonbakgrunn>
            <CogRotationIcon fr="mask" fontSize="15" aria-label="System" />
        </TidslinjeIkonbakgrunn>
    );
};

export { SystemIkon };
