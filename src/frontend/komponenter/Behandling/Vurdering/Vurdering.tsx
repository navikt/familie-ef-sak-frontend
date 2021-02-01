import * as React from 'react';
import { FC } from 'react';
import {
    IInngangsvilkår,
    IVurdering,
    VilkårGruppe,
    Vurderingsfeilmelding,
} from '../Inngangsvilkår/vilkår';
import { filtrerVurderinger, vilkårStatus } from './VurderingUtil';
import VisEllerEndreVurdering from './VisEllerEndreVurdering';
import styled from 'styled-components';
import { navLysGra } from '@navikt/familie-header';
import { VilkårGruppeConfig } from '../Inngangsvilkår/config/VilkårGruppeConfig';
import { Ressurs } from '../../../typer/ressurs';

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
    barneId?: string;
    vilkårGruppe: VilkårGruppe;
    inngangsvilkår: IInngangsvilkår;
    lagreVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    feilmeldinger: Vurderingsfeilmelding;
}

const Vurdering: FC<Props> = ({
    vilkårGruppe,
    inngangsvilkår,
    lagreVurdering,
    feilmeldinger,
    barneId,
}) => {
    const vurderinger = inngangsvilkår.vurderinger;
    const filtrerteVurderinger = filtrerVurderinger(vurderinger, vilkårGruppe);
    const status = vilkårStatus(filtrerteVurderinger);

    const config = VilkårGruppeConfig[vilkårGruppe];
    if (!config) {
        return <div>Mangler config for {vilkårGruppe}</div>;
    }

    return (
        <StyledVilkårOgVurdering>
            <StyledVisning>
                {config.visning(inngangsvilkår.grunnlag, status, barneId)}
            </StyledVisning>
            <StyledVurderinger>
                {filtrerteVurderinger.map((vurdering) => (
                    <VisEllerEndreVurdering
                        key={vurdering.id}
                        inngangsvilkårgrunnlag={inngangsvilkår.grunnlag}
                        vurdering={vurdering}
                        feilmelding={feilmeldinger[vurdering.id]}
                        lagreVurdering={lagreVurdering}
                    />
                ))}
            </StyledVurderinger>
            <StyledSkillelinje />
        </StyledVilkårOgVurdering>
    );
};

export default Vurdering;
