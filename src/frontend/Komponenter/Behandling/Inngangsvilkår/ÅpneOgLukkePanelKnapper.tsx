import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

interface Props {
    lukkAlle: () => void;
    åpneAlle: () => void;
}

export const ÅpneOgLukkePanelKnapper: React.FC<Props> = ({ lukkAlle, åpneAlle }) => {
    return (
        <>
            <Button variant="tertiary" icon={<ChevronUpIcon />} size="small" onClick={lukkAlle}>
                Lukk alle
            </Button>
            <Button variant="tertiary" icon={<ChevronDownIcon />} size="small" onClick={åpneAlle}>
                Åpne alle
            </Button>
        </>
    );
};
