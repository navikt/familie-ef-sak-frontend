import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårPropsMedBehandlingsstatus } from '../vilkårprops';
import SamlivInfo from './SamlivInfo';
import { Vilkårstittel } from '../Vilkårstittel';

export const Samliv: React.FC<VilkårPropsMedBehandlingsstatus> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
    skalViseSøknadsdata,
    behandlingId,
    behandlingsstatus,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === InngangsvilkårType.SAMLIV);
    if (!vurdering) {
        return <div>Mangler vurdering for samliv</div>;
    }
    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel
                            paragrafTittel="§15-4"
                            tittel="Samliv"
                            vilkårsresultat={vurdering.resultat}
                        />
                        <SamlivInfo
                            behandlingId={behandlingId}
                            grunnlag={grunnlag}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                            behandlingsstatus={behandlingsstatus}
                        />
                    </>
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
        </ToKolonnerLayout>
    );
};
