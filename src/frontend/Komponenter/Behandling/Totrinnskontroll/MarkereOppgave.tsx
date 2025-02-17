import { CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React, { useState } from 'react';

export const MarkereOppgave = () => {
    const [state, setState] = useState(['taxi']);

    return (
        <CheckboxGroup legend="Transportmiddel" onChange={setState} value={state}>
            <Checkbox value="særligTilsynskrevendeBarn">Særlig tilsynskrevende barn</Checkbox>
            <Checkbox value="selvstendigNæringsdrivende">Selvstendig næringsdrivende</Checkbox>
            <Checkbox value="eøs">EØS</Checkbox>
        </CheckboxGroup>
    );
};
