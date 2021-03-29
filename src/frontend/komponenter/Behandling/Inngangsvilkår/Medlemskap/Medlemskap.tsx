import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import Vilkår from '../../../Felleskomponenter/Vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import MedlemskapInfo from './MedlemskapInfo';

export const Medlemskap: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
}) => {
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === InngangsvilkårType.FORUTGÅENDE_MEDLEMSKAP
    );
    if (!vurdering) {
        return <div>Mangler vurdering for forutgående medlemskap</div>;
    }
    return (
        <Vilkår
            vilkårtittel={{
                paragrafTittel: '§15-2',
                tittel: 'Forutgående medlemskap',
                vilkårsresultat: vurdering.resultat,
            }}
        >
            {{
                left: <MedlemskapInfo medlemskap={grunnlag.medlemskap} />,
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
