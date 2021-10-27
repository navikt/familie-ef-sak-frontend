import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import OppholdInfo from './OppholdInfo';
import { Vilkårstittel } from '../Vilkårstittel';

type OppholdVilkårProps = VilkårProps & { skalViseSøknadsdata: boolean };

export const Opphold: React.FC<OppholdVilkårProps> = ({
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
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel
                            paragrafTittel="§15-3"
                            tittel="Opphold i Norge"
                            vilkårsresultat={vurdering.resultat}
                        />
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
        </ToKolonnerLayout>
    );
};
