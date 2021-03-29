import React from 'react';
import {
    InngangsvilkårType,
    IVilkårGrunnlag,
    IVurdering,
    NullstillVilkårsvurdering,
    OppdaterVilkårsvurdering,
    Vurderingsfeilmelding,
} from '../vilkår';
import Vilkår from '../../../Felleskomponenter/Vilkår';
import NyttBarnSammePartnerInfo from './NyttBarnSammePartnerInfo';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { Ressurs } from '../../../../typer/ressurs';

interface Props {
    vurderinger: IVurdering[];
    grunnlag: IVilkårGrunnlag;
    lagreVurdering: (vurdering: OppdaterVilkårsvurdering) => Promise<Ressurs<IVurdering>>;
    nullstillVurdering: (
        nullstillVilkårsvurdering: NullstillVilkårsvurdering
    ) => Promise<Ressurs<IVurdering>>;
    feilmeldinger: Vurderingsfeilmelding;
}

export const NyttBarnSammePartner: React.FC<Props> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
}) => {
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === InngangsvilkårType.NYTT_BARN_SAMME_PARTNER
    );
    const barnMedSamvær = grunnlag.barnMedSamvær;
    if (!vurdering) {
        return <div>Mangler vurdering for NyttBarnSammePartner</div>;
    }
    return (
        <Vilkår
            vilkårtittel={{
                paragrafTittel: '§15-4',
                tittel: 'Nytt barn samme partner',
                vilkårsresultat: vurdering.resultat,
            }}
        >
            {{
                left: <NyttBarnSammePartnerInfo barnMedSamvær={barnMedSamvær} />,
                right: (
                    <VisEllerEndreVurdering
                        vurdering={vurdering}
                        feilmelding={feilmeldinger[vurdering.id]}
                        lagreVurdering={lagreVurdering}
                        nullstillVurdering={nullstillVurdering}
                    />
                ),
            }}
        </Vilkår>
    );
};
