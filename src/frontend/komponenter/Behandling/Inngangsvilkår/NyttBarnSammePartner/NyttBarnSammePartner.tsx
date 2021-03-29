import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import Vilkår from '../../../Felleskomponenter/Vilkår';
import NyttBarnSammePartnerInfo from './NyttBarnSammePartnerInfo';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';

export const NyttBarnSammePartner: React.FC<VilkårProps> = ({
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
