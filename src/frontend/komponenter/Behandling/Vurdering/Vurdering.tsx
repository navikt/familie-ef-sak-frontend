import * as React from 'react';
import { FC } from 'react';
import {
    IVilkår,
    IVurdering,
    NullstillVilkårsvurdering,
    VilkårType,
    Vurderingsfeilmelding,
} from '../Inngangsvilkår/vilkår';
import { vilkårsresultat } from './VurderingUtil';
import VisEllerEndreVurdering from './VisEllerEndreVurdering';
import styled from 'styled-components';
import { VilkårGruppeConfig } from '../Inngangsvilkår/config/VilkårGruppeConfig';
import { Ressurs } from '../../../typer/ressurs';
import navFarger from 'nav-frontend-core';

const StyledVilkårOgVurdering = styled.div`
    display: contents;
`;

const StyledVisning = styled.div`
    min-width: 600px;
    grid-column: 1;
`;

const StyledSkillelinje = styled.div`
    height: 2px;
    border: solid 1px ${navFarger.navLysGra};
    grid-column: 1/3;
`;

const StyledVurderinger = styled.div`
    > div:not(:first-child) {
        padding-top: 20px;
    }
`;

interface Props {
    barnId?: string;
    vilkårGruppe: VilkårType;
    inngangsvilkår: IVilkår;
    lagreVurdering: (vurdering: IVurdering) => Promise<Ressurs<IVurdering>>;
    nullstillVurdering: (vurdering: NullstillVilkårsvurdering) => Promise<Ressurs<IVurdering>>;
    feilmeldinger: Vurderingsfeilmelding;
}

const Vurdering: FC<Props> = ({
    vilkårGruppe,
    inngangsvilkår,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    barnId,
}) => {
    const vurderinger = inngangsvilkår.vurderinger;

    const status = vilkårsresultat(vurderinger, vilkårGruppe);

    const config = VilkårGruppeConfig[vilkårGruppe];
    if (!config) {
        return <div>Mangler config for {vilkårGruppe}</div>;
    }

    return (
        <StyledVilkårOgVurdering>
            <StyledVisning>{config.visning(inngangsvilkår.grunnlag, status, barnId)}</StyledVisning>
            <StyledVurderinger>
                {vurderinger
                    .filter((vurdering) => vurdering.vilkårType === vilkårGruppe)
                    .filter((vurdering) => (vurdering.barnId ? vurdering.barnId === barnId : true))
                    .map((vurdering) => (
                        <VisEllerEndreVurdering
                            key={vurdering.id}
                            vurdering={vurdering}
                            feilmelding={feilmeldinger[vurdering.id]}
                            lagreVurdering={lagreVurdering}
                            nullstillVurdering={nullstillVurdering}
                        />
                    ))}
            </StyledVurderinger>
            <StyledSkillelinje />
        </StyledVilkårOgVurdering>
    );
};

export default Vurdering;
