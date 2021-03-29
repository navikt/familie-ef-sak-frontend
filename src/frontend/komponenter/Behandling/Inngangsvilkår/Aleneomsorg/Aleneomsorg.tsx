import React from 'react';
import { vilkårStatusAleneomsorg } from '../../Vurdering/VurderingUtil';
import Vilkår from '../../../Felleskomponenter/Vilkår';
import { InngangsvilkårType } from '../vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import AleneomsorgInfo from './AleneomsorgInfo';
import { VilkårProps } from '../vilkårprops';

export const Aleneomsorg: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
}) => {
    const vilkårsresultat = vilkårStatusAleneomsorg(vurderinger);
    return (
        <>
            {vurderinger
                .filter((vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG)
                .map((vurdering, idx) => (
                    <Vilkår
                        key={vurdering.id}
                        vilkårtittel={
                            idx === 0
                                ? {
                                      paragrafTittel: '§15-4',
                                      tittel: 'Aleneomsorg',
                                      vilkårsresultat,
                                  }
                                : undefined
                        }
                    >
                        {{
                            left: (
                                <AleneomsorgInfo
                                    barnMedSamvær={grunnlag.barnMedSamvær}
                                    barnId={vurdering.barnId}
                                />
                            ),
                            right: (
                                <VisEllerEndreVurdering
                                    key={vurdering.id}
                                    vurdering={vurdering}
                                    feilmelding={feilmeldinger[vurdering.id]}
                                    lagreVurdering={lagreVurdering}
                                    nullstillVurdering={nullstillVurdering}
                                />
                            ),
                        }}
                    </Vilkår>
                ))}
        </>
    );
};
