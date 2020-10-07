import * as React from 'react';
import { IMedlemskap, IVurdering } from '../vilkår';
import { FC } from 'react';
import MedlemskapVisning from './MedlemskapVisning';
import styled from 'styled-components';
import Vurdering from '../../Vurdering/Vurdering';

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
    vurderinger: IVurdering[];
}

const Medlemskap: FC<Props> = ({ medlemskap, vurderinger }) => {
    return (
        <StyledMedlemskap>
            <MedlemskapVisning className="visning" medlemskap={medlemskap} />
            <Vurdering className="vurdering" vurdering={vurderinger[0]} />
        </StyledMedlemskap>
    );
};
export default Medlemskap;
