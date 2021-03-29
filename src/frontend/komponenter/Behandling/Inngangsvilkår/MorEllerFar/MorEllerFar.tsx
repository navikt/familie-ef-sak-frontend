import React from 'react';
import { VilkårProps } from '../vilkårprops';
import Vilkår from '../../../Felleskomponenter/Vilkår';
import { InngangsvilkårType } from '../vilkår';
import MorEllerFarInfo from './MorEllerFarInfo';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';

export const MorEllerFar: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === InngangsvilkårType.MOR_ELLER_FAR);
    if (!vurdering) {
        return <div>Mangler vurdering for Mor eller far</div>;
    }
    return (
        <Vilkår paragrafTittel="§15-4" tittel="Mor eller Far" vilkårsresultat={vurdering.resultat}>
            {{
                left: <MorEllerFarInfo barnMedSamvær={grunnlag.barnMedSamvær} />,
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
