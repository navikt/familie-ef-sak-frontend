import * as React from 'react';
import { IMedlemskap } from '../vilkår';
import { FC } from 'react';
import MedlemskapVisning from './MedlemskapVisning';
import styled from 'styled-components';
import MedlemskapVurdering from './MedlemskapVurdering';

const StyledMedlemskap = styled.div`
    display: contents;

    .visning {
        grid-column: 1/2;
    }
    .vurdering {
        grid-column: 2/3;
    }
`;

interface Props {
    medlemskap: IMedlemskap;
}

const Medlemskap: FC<Props> = ({ medlemskap }) => {
    return (
        <StyledMedlemskap>
            <MedlemskapVisning className="visning" medlemskap={medlemskap} />
            <MedlemskapVurdering className="vurdering" />
        </StyledMedlemskap>
    );
};
export default Medlemskap;
