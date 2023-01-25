import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import MorEllerFarInfo from './MorEllerFarInfo';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';
import { EInngangsvilkår } from '../../../../App/context/EkspanderbareVilkårpanelContext';

export const MorEllerFar: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
    ikkeVurderVilkår,
    skalViseSøknadsdata,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === InngangsvilkårType.MOR_ELLER_FAR);
    if (!vurdering) {
        return <div>Mangler vurdering for Mor eller far</div>;
    }
    return (
        <Vilkårpanel
            paragrafTittel="§15-4"
            tittel="Mor eller Far"
            vilkårsresultat={vurdering.resultat}
            vilkår={EInngangsvilkår.MOR_ELLER_FAR}
        >
            <VilkårpanelInnhold>
                {{
                    venstre: (
                        <MorEllerFarInfo
                            barnMedSamvær={grunnlag.barnMedSamvær}
                            dokumentasjon={grunnlag.dokumentasjon}
                            skalViseSøknadsdata={skalViseSøknadsdata}
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
