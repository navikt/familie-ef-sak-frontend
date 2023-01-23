import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import SivilstandInfo from './SivilstandInfo';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';

export const Sivilstand: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
    skalViseSøknadsdata,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === InngangsvilkårType.SIVILSTAND);
    if (!vurdering) {
        return <div>Mangler vurdering for sivilstand</div>;
    }
    return (
        <Vilkårpanel
            paragrafTittel="§15-4"
            tittel="Sivilstand"
            vilkårsresultat={vurdering.resultat}
        >
            {{
                venstre: (
                    <SivilstandInfo
                        sivilstand={grunnlag.sivilstand}
                        skalViseSøknadsdata={skalViseSøknadsdata}
                        dokumentasjon={grunnlag.dokumentasjon}
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
        </Vilkårpanel>
    );
};
