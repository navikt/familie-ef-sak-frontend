import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import Vilkår from '../../../Felleskomponenter/Vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import SagtOppEllerRedusertInfo from './SagtOppEllerRedusertInfo';

export const SagtOppEllerRedusert: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
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
        <Vilkår
            vilkårtittel={{
                tittel: 'Sagt opp arbeidsforhold',
                vilkårsresultat: vurdering.resultat,
            }}
        >
            {{
                left: (
                    <SagtOppEllerRedusertInfo
                        sagtOppEllerRedusert={grunnlag.sagtOppEllerRedusertStilling}
                    />
                ),
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
