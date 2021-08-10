import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import SagtOppEllerRedusertInfo from './SagtOppEllerRedusertInfo';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';

export const SagtOppEllerRedusert: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    ikkeVurderVilkår,
    nullstillVurdering,
    feilmeldinger,
}) => {
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === AktivitetsvilkårType.SAGT_OPP_ELLER_REDUSERT
    );
    if (!vurdering) {
        return <div>Mangler vurdering for sagt opp arbeidsforhold</div>;
    }
    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel
                            tittel="Sagt opp arbeidsforhold"
                            vilkårsresultat={vurdering.resultat}
                        />
                        <SagtOppEllerRedusertInfo
                            sagtOppEllerRedusert={grunnlag.sagtOppEllerRedusertStilling}
                        />
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
