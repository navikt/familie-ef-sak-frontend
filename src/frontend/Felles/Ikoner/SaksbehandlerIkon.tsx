import * as React from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';

import { TidslinjeIkonbakgrunn } from './ikonelementer';

const SaksbehandlerIkon: React.FC = () => {
    return (
        <TidslinjeIkonbakgrunn>
            <PersonPencilFillIcon fr="mask" fontSize="15" aria-label="Saksbehandler" />
        </TidslinjeIkonbakgrunn>
    );
};

export { SaksbehandlerIkon };
