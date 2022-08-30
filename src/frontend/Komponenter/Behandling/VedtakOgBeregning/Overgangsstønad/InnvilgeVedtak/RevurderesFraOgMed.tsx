import React, { Dispatch, SetStateAction } from 'react';
import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import styled from 'styled-components';
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema';

const WrapperMarginBottom = styled.div`
    margin-bottom: 2rem;
`;

export const RevurderesFraOgMed: React.FC<{
    settRevurderesFra: Dispatch<SetStateAction<string | undefined>>;
    revurderesFra: string | undefined;
    feilmelding: string | null;
}> = ({ settRevurderesFra, revurderesFra, feilmelding }) => {
    return (
        <WrapperMarginBottom>
            <MånedÅrVelger
                label={'Revurderes fra og med'}
                onEndret={(årMåned) => {
                    if (!årMåned) return;

                    settRevurderesFra(årMåned);
                }}
                antallÅrTilbake={5}
                antallÅrFrem={3}
                årMånedInitiell={revurderesFra}
            />
            {feilmelding && <SkjemaelementFeilmelding>{feilmelding}</SkjemaelementFeilmelding>}
        </WrapperMarginBottom>
    );
};
