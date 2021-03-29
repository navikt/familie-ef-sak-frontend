import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import Vilkår from '../../../Felleskomponenter/Vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import OppholdInfo from './OppholdInfo';

export const Opphold: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === InngangsvilkårType.LOVLIG_OPPHOLD);
    if (!vurdering) {
        return <div>Mangler vurdering for opphold</div>;
    }
    return (
        <Vilkår
            vilkårtittel={{
                paragrafTittel: '§15-3',
                tittel: 'Opphold i Norge',
                vilkårsresultat: vurdering.resultat,
            }}
        >
            {{
                left: <OppholdInfo medlemskap={grunnlag.medlemskap} />,
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
