import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { filtrerFanerPåBehandlingstype } from './faner';
import { Sticky } from '../../../Felles/Visningskomponenter/Sticky';
import { AWhite, ABorderDefault } from '@navikt/ds-tokens/dist/tokens';
import { Behandling } from '../../../App/typer/fagsak';
import { Fane } from './Fane';

const StickyMedBoxShadow = styled(Sticky)`
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    z-index: 22;
`;

const StyledFanemeny = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${ABorderDefault} solid 2px;
    background-color: ${AWhite};
`;

interface Props {
    behandling: Behandling;
}

export const Fanemeny: FC<Props> = ({ behandling }) => (
    <StickyMedBoxShadow>
        <StyledFanemeny>
            {filtrerFanerPåBehandlingstype(behandling).map((fane, index) => (
                <Fane fane={fane} behandling={behandling} index={index} key={index} />
            ))}
        </StyledFanemeny>
    </StickyMedBoxShadow>
);
