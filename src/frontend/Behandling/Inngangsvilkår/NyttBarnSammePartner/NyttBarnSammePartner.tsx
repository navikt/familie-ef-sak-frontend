import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import NyttBarnSammePartnerInfo from './NyttBarnSammePartnerInfo';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import { Vilkårstittel } from '../Vilkårstittel';

export const NyttBarnSammePartner: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    ikkeVurderVilkår,
}) => {
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === InngangsvilkårType.NYTT_BARN_SAMME_PARTNER
    );
    const barnMedSamvær = grunnlag.barnMedSamvær;
    if (!vurdering) {
        return <div>Mangler vurdering for NyttBarnSammePartner</div>;
    }
    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel
                            paragrafTittel="§15-4"
                            tittel="Nytt barn med samme partner"
                            vilkårsresultat={vurdering.resultat}
                        />
                        <NyttBarnSammePartnerInfo barnMedSamvær={barnMedSamvær} />
                    </>
                ),
                høyre: (
                    <VisEllerEndreVurdering
                        ikkeVurderVilkår={ikkeVurderVilkår}
                        vurdering={vurdering}
                        feilmelding={feilmeldinger[vurdering.id]}
                        lagreVurdering={lagreVurdering}
                        nullstillVurdering={nullstillVurdering}
                    />
                ),
            }}
        </ToKolonnerLayout>
    );
};
