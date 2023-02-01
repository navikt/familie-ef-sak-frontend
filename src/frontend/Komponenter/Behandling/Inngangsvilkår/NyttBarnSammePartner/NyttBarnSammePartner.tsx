import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import NyttBarnSammePartnerInfo from './NyttBarnSammePartnerInfo';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';

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
        <Vilkårpanel
            paragrafTittel="§15-4"
            tittel="Nytt barn med samme partner"
            vilkårsresultat={vurdering.resultat}
            vilkår={vurdering.vilkårType}
        >
            <VilkårpanelInnhold>
                {{
                    venstre: (
                        <NyttBarnSammePartnerInfo
                            barnMedSamvær={barnMedSamvær}
                            tidligereVedtaksperioder={grunnlag.tidligereVedtaksperioder}
                        />
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
            </VilkårpanelInnhold>
        </Vilkårpanel>
    );
};
