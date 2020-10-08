import * as React from 'react';
import { FC, ReactChild } from 'react';
import { VilkårDel } from './VurderingConfig';
import { IVurdering } from '../Inngangsvilkår/vilkår';
import { alleErOppfylte, filtrerVurderinger } from './VurderingUtil';
import VisEllerEndreVurdering from './VisEllerEndreVurdering';
import styled from 'styled-components';
import { navLysGra } from '@navikt/familie-header';
import { Ressurs } from '@navikt/familie-typer';

const StyledVilkårOgVurdering = styled.div`
    display: contents;
`;

const StyledVisning = styled.div`
    min-width: 600px;
`;

const StyledSkillelinje = styled.div`
    height: 2px;
    border: solid 1px ${navLysGra};
    grid-column: 1/3;
`;

const StyledVurderinger = styled.div`
    > div:not(:first-child) {
        padding-top: 20px;
    }
`;

interface Props {
    vilkårDel: VilkårDel;
    vurderinger: IVurdering[];
    oppdaterVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    visning: (erOppfylt: boolean) => ReactChild;
}

const Vurdering: FC<Props> = ({ vilkårDel, vurderinger, oppdaterVurdering, visning }) => {
    const filtrerteVurderinger = filtrerVurderinger(vurderinger, vilkårDel);
    const erOppfylte = alleErOppfylte(filtrerteVurderinger);
    return (
        <StyledVilkårOgVurdering>
            <StyledVisning>{visning(erOppfylte)}</StyledVisning>
            <StyledVurderinger>
                {filtrerteVurderinger.map((vurdering) => (
                    <VisEllerEndreVurdering
                        vurdering={vurdering}
                        oppdaterVurdering={oppdaterVurdering}
                    />
                ))}
            </StyledVurderinger>
            <StyledSkillelinje />
        </StyledVilkårOgVurdering>
    );
};

export default Vurdering;
