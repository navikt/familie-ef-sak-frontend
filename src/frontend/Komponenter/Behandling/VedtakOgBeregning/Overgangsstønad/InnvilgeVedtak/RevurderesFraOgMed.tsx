import React, { Dispatch, SetStateAction } from 'react';
import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import styled from 'styled-components';

const WrapperMarginBottom = styled.div`
    margin-bottom: 2rem;
`;

export const RevurderesFraOgMed: React.FC<{
    settRevurderesFra: Dispatch<SetStateAction<string | undefined>>;
}> = ({ settRevurderesFra }) => {
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
            />
        </WrapperMarginBottom>
    );
};
