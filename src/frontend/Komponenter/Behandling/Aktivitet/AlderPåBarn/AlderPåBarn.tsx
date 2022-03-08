import React from 'react';
import { vilkårStatusAleneomsorg } from '../../Vurdering/VurderingUtil';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import AlderPåBarnInfo from './AlderPåBarnInfo';

export const AlderPåBarn: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
    ikkeVurderVilkår,
    skalViseSøknadsdata,
}) => {
    const vilkårsresultatAlderPåBarn = vurderinger
        .filter((vurdering) => vurdering.vilkårType === AktivitetsvilkårType.ALDER_PÅ_BARN)
        .map((v) => v.resultat);
    const utleddResultat = vilkårStatusAleneomsorg(vilkårsresultatAlderPåBarn);

    return (
        <>
            {grunnlag.barnMedSamvær.map((barn, idx) => {
                const vurdering = vurderinger.find(
                    (v) =>
                        v.barnId === barn.barnId &&
                        v.vilkårType === AktivitetsvilkårType.ALDER_PÅ_BARN
                );
                if (!vurdering) return null;
                return (
                    <ToKolonnerLayout key={barn.barnId}>
                        {{
                            venstre: (
                                <>
                                    {idx === 0 && (
                                        <Vilkårstittel
                                            paragrafTittel="§15-10"
                                            tittel="Alder på barn"
                                            vilkårsresultat={utleddResultat}
                                        />
                                    )}
                                    <AlderPåBarnInfo
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
