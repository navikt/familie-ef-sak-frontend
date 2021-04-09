import React from 'react';
import { vilkårStatusAleneomsorg } from '../../Vurdering/VurderingUtil';
import ToKolonnerLayout from '../../../Felleskomponenter/ToKolonnerLayout';
import { InngangsvilkårType } from '../vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import AleneomsorgInfo from './AleneomsorgInfo';
import { VilkårProps } from '../vilkårprops';
import { Vilkårstittel } from '../Vilkårstittel';

export const Aleneomsorg: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
    ikkeVurderVilkår,
}) => {
    const vilkårsresultat = vilkårStatusAleneomsorg(vurderinger);
    return (
        <>
            {vurderinger
                .filter((vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG)
                .map((vurdering, idx) => (
                    <ToKolonnerLayout key={vurdering.id}>
                        {{
                            venstre: (
                                <>
                                    {idx === 0 && (
                                        <Vilkårstittel
                                            paragrafTittel="§15-4"
                                            tittel="Aleneomsorg"
                                            vilkårsresultat={vilkårsresultat}
                                        />
                                    )}
                                    <AleneomsorgInfo
                                        barnMedSamvær={grunnlag.barnMedSamvær}
                                        barnId={vurdering.barnId}
                                    />
                                </>
                            ),
                            høyre: (
                                <VisEllerEndreVurdering
                                    key={vurdering.id}
                                    ikkeVurderVilkår={ikkeVurderVilkår}
                                    vurdering={vurdering}
                                    feilmelding={feilmeldinger[vurdering.id]}
                                    lagreVurdering={lagreVurdering}
                                    nullstillVurdering={nullstillVurdering}
                                />
                            ),
                        }}
                    </ToKolonnerLayout>
                ))}
        </>
    );
};
