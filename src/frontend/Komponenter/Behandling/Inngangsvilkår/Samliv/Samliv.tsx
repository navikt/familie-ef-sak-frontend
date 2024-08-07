import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårPropsMedBehandling } from '../vilkårprops';
import SamlivInfo from './SamlivInfo';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';

export const Samliv: React.FC<VilkårPropsMedBehandling> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
    skalViseSøknadsdata,
    behandling,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === InngangsvilkårType.SAMLIV);
    if (!vurdering) {
        return <div>Mangler vurdering for samliv</div>;
    }
    return (
        <Vilkårpanel
            paragrafTittel="§15-4"
            tittel="Samliv"
            vilkårsresultat={vurdering.resultat}
            vilkår={vurdering.vilkårType}
        >
            <VilkårpanelInnhold>
                {{
                    venstre: (
                        <SamlivInfo
                            grunnlag={grunnlag}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                            behandling={behandling}
                        />
                    ),
                    høyre: (
                        <VisEllerEndreVurdering
                            vurdering={vurdering}
                            ikkeVurderVilkår={ikkeVurderVilkår}
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
