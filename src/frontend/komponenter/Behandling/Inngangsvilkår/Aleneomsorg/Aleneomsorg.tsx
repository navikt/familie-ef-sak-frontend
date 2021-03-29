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
        <Vilkår
            paragrafTittel="§15-4"
            tittel="Nytt barn samme partner"
            vilkårsresultat={vilkårsresultat}
        >
            {{
                left: (
                    <>
                        {grunnlag.barnMedSamvær.map((barn) => (
                            <AleneomsorgInfo
                                barnMedSamvær={grunnlag.barnMedSamvær}
                                barnId={barn.barnId}
                            />
                        ))}
                    </>
                ),
                right: (
                    <>
                        {vurderinger
                            .filter(
                                (vurdering) =>
                                    vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG
                            )
                            .map((vurdering) => (
                                <VisEllerEndreVurdering
                                    key={vurdering.id}
                                    vurdering={vurdering}
                                    feilmelding={feilmeldinger[vurdering.id]}
                                    lagreVurdering={lagreVurdering}
                                    nullstillVurdering={nullstillVurdering}
                                />
                            ))}
                    </>
                ),
            }}
        </Vilkår>
    );
};
