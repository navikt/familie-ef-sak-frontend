import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import OppholdInfo from './OppholdInfo';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';

export const Opphold: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
    skalViseSøknadsdata,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === InngangsvilkårType.LOVLIG_OPPHOLD);
    if (!vurdering) {
        return <div>Mangler vurdering for opphold</div>;
    }
    return (
        <Vilkårpanel
            paragrafTittel="§15-3"
            tittel="Opphold i Norge"
            vilkårsresultat={vurdering.resultat}
        >
            {{
                venstre: (
                    <>
                        <OppholdInfo
                            medlemskap={grunnlag.medlemskap}
                            skalViseSøknadsdata={skalViseSøknadsdata}
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
        </Vilkårpanel>
    );
};
