import * as React from 'react';
import { FC } from 'react';
import { VilkårDel, VilkårDelConfig } from './VurderingConfig';
import { IInngangsvilkår, IVurdering } from '../Inngangsvilkår/vilkår';
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
    inngangsvilkår: IInngangsvilkår;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
}

const Vurdering: FC<Props> = ({ vilkårDel, inngangsvilkår, oppdaterVurdering }) => {
    const vurderinger = inngangsvilkår.vurderinger;
    const filtrerteVurderinger = filtrerVurderinger(vurderinger, vilkårDel);
    const erOppfylte = alleErOppfylte(filtrerteVurderinger);

    const config = VilkårDelConfig[vilkårDel];
    if (!config) {
        return <div>Savner config for {vilkårDel}</div>;
    }

    return (
        <StyledVilkårOgVurdering>
            <StyledVisning>{config.visning(erOppfylte, inngangsvilkår)}</StyledVisning>
            <StyledVurderinger>
                {filtrerteVurderinger.map((vurdering) => (
                    <VisEllerEndreVurdering
                        key={vurdering.id}
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
