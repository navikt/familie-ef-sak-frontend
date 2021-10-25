import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import SivilstandInfo from './SivilstandInfo';
import { Vilkårstittel } from '../Vilkårstittel';

export const Sivilstand: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
    skalSkjuleSøknadsdata,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === InngangsvilkårType.SIVILSTAND);
    if (!vurdering) {
        return <div>Mangler vurdering for sivilstand</div>;
    }
    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel
                            paragrafTittel="§15-4"
                            tittel="Sivilstand"
                            vilkårsresultat={vurdering.resultat}
                        />
                        <SivilstandInfo
                            sivilstand={grunnlag.sivilstand}
                            skalSkjuleSøknadsdata={skalSkjuleSøknadsdata}
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
