import React from 'react';
import { vilkårStatusAleneomsorg } from '../../Vurdering/VurderingUtil';
import ToKolonnerLayout from '../../../Felleskomponenter/ToKolonnerLayout';
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
}) => {
    const vilkårsresultat = vilkårStatusAleneomsorg(vurderinger);
    return (
        <>
            {grunnlag.barnMedSamvær.map((barn, idx) => {
                const vurdering = vurderinger.find((v) => v.barnId === barn.barnId);
                if (!vurdering) return null;
                return (
                    <ToKolonnerLayout key={barn.barnId}>
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
                                    <AleneomsorgInfo gjeldendeBarn={barn} />
                                </>
                            ),
                            høyre: (
                                <VisEllerEndreVurdering
                                    key={vurdering.id}
                                    vurdering={vurdering}
                                    feilmelding={feilmeldinger[vurdering.id]}
                                    lagreVurdering={lagreVurdering}
                                    nullstillVurdering={nullstillVurdering}
                                />
                            ),
                        }}
                    </ToKolonnerLayout>
                );
            })}
        </>
    );
};
