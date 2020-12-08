import { Hovedknapp } from 'nav-frontend-knapper';
import * as React from 'react';
import { FC } from 'react';

interface Props {
    lagreVurdering: () => void;
    disabled: boolean;
}

const LagreVurderingKnapp: FC<Props> = ({ lagreVurdering, disabled }) => {
    return (
        <Hovedknapp mini onClick={lagreVurdering} disabled={disabled}>
            Lagre
        </Hovedknapp>
    );
};

export default LagreVurderingKnapp;
