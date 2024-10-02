import React, { Dispatch, SetStateAction } from 'react';
import { Checkbox } from '@navikt/ds-react';

interface Props {
    klageGjelderTilbakekreving: boolean;
    settKlageGjelderTilbakekreving: Dispatch<SetStateAction<boolean>>;
}

export const KlageGjelderTilbakekreving: React.FC<Props> = ({
    klageGjelderTilbakekreving,
    settKlageGjelderTilbakekreving,
}) => {
    const håndterCheck = () => {
        settKlageGjelderTilbakekreving((prevState) => !prevState);
    };

    return (
        <Checkbox size="small" checked={klageGjelderTilbakekreving} onChange={håndterCheck}>
            Klagen gjelder tilbakekreving
        </Checkbox>
    );
};
