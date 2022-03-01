import React from 'react';
import { vilkårStatusAleneomsorg } from '../../Vurdering/VurderingUtil';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import AleneomsorgInfo from './AleneomsorgInfo';
import { VilkårProps } from '../vilkårprops';
import { Vilkårstittel } from '../Vilkårstittel';
import { InngangsvilkårType } from '../vilkår';

export const Aleneomsorg: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
    ikkeVurderVilkår,
    skalViseSøknadsdata,
}) => {
    const vilkårsresultatAleneomsorg = vurderinger
        .filter((vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG)
        .map((v) => v.resultat);
    const utleddResultat = vilkårStatusAleneomsorg(vilkårsresultatAleneomsorg);
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
                                            vilkårsresultat={utleddResultat}
                                        />
                                    )}
                                    <AleneomsorgInfo
                                        gjeldendeBarn={barn}
                                        skalViseSøknadsdata={skalViseSøknadsdata}
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
                );
            })}
        </>
    );
};
