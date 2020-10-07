import * as React from 'react';
import { FC } from 'react';
import { IMedlemskap, IVurdering } from '../vilkår';
import MedlemskapVisning from './MedlemskapVisning';
import styled from 'styled-components';
import Vurdering from '../../Vurdering/Vurdering';
import { alleErOppfylte } from '../../Vurdering/VurderingUtil';

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
    oppdaterVurdering: (vurdering: IVurdering) => Promise<void>;
}

const Medlemskap: FC<Props> = ({ medlemskap, vurderinger, oppdaterVurdering }) => {
    return (
        <StyledMedlemskap>
            <MedlemskapVisning
                className="visning"
                medlemskap={medlemskap}
                erOppfylt={alleErOppfylte(vurderinger)}
            />
            {vurderinger.map((vurdering) => (
                <Vurdering
                    className="vurdering"
                    vurdering={vurdering}
                    oppdaterVurdering={oppdaterVurdering}
                />
            ))}
        </StyledMedlemskap>
    );
};
export default Medlemskap;
