import React, { Dispatch, SetStateAction } from 'react';
import { Checkbox } from '@navikt/ds-react';

interface KlageGjelderTilbakekrevingProps {
    klageGjelderTilbakekreving: boolean;
    settKlageGjelderTilbakekreving: Dispatch<SetStateAction<boolean>>;
}

const KlageGjelderTilbakekreving: React.FC<KlageGjelderTilbakekrevingProps> = ({
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

export default KlageGjelderTilbakekreving;
