import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import Vilkår from '../../../Felleskomponenter/Vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import SivilstandInfo from './SivilstandInfo';

export const Sivilstand: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === InngangsvilkårType.SIVILSTAND);
    if (!vurdering) {
        return <div>Mangler vurdering for sivilstand</div>;
    }
    return (
        <Vilkår
            vilkårtittel={{
                paragrafTittel: '§15-4',
                tittel: 'Sivilstand',
                vilkårsresultat: vurdering.resultat,
            }}
        >
            {{
                left: <SivilstandInfo sivilstand={grunnlag.sivilstand} />,
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
