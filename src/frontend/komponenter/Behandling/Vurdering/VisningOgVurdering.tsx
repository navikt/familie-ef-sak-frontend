import * as React from 'react';
import { FC, ReactChild } from 'react';
import { VilkårDel } from './VurderingConfig';
import { IVurdering } from '../Inngangsvilkår/vilkår';
import { alleErOppfylte, filtrerVurderinger } from './VurderingUtil';
import Vurdering from './Vurdering';
import styled from 'styled-components';

const StyledVilkårOgVurdering = styled.div`
    display: contents;

    > div:first-child {
        grid-column: 1/2;
    }
    > div:not(:first-child) {
        grid-column: 2/3;
    }
`;

const StyledVurderinger = styled.div`
    > div:not(:first-child) {
        padding-top: 20px;
    }
`;

interface Props {
    vilkårDel: VilkårDel;
    vurderinger: IVurdering[];
    oppdaterVurdering: (vurdering: IVurdering) => Promise<void>;
    visning: (erOppfylt: boolean) => ReactChild;
}

const VisningOgVurdering: FC<Props> = ({ vilkårDel, vurderinger, oppdaterVurdering, visning }) => {
    const filtrerteVurderinger = filtrerVurderinger(vurderinger, vilkårDel);
    const erOppfylte = alleErOppfylte(filtrerteVurderinger);
    return (
        <StyledVilkårOgVurdering>
            <div>{visning(erOppfylte)}</div>
            <StyledVurderinger>
                {filtrerteVurderinger.map((vurdering) => (
                    <Vurdering data={vurdering} oppdaterVurdering={oppdaterVurdering} />
                ))}
            </StyledVurderinger>
        </StyledVilkårOgVurdering>
    );
};

export default VisningOgVurdering;
