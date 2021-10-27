import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import SamlivInfo from './SamlivInfo';
import { Vilkårstittel } from '../Vilkårstittel';

type SamlivVilkårProps = VilkårProps & { skalViseSøknadsdata: boolean };

export const Samliv: React.FC<SamlivVilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
    skalViseSøknadsdata,
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
                        <SamlivInfo grunnlag={grunnlag} skalViseSøknadsdata={skalViseSøknadsdata} />
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
