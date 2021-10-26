import React from 'react';
import { VilkårProps } from '../vilkårprops';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import { InngangsvilkårType } from '../vilkår';
import MorEllerFarInfo from './MorEllerFarInfo';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { Vilkårstittel } from '../Vilkårstittel';

type MorEllerFarVilkårProps = VilkårProps & { skalViseSøknadsdata: boolean };

export const MorEllerFar: React.FC<MorEllerFarVilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
    ikkeVurderVilkår,
    skalViseSøknadsdata,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === InngangsvilkårType.MOR_ELLER_FAR);
    if (!vurdering) {
        return <div>Mangler vurdering for Mor eller far</div>;
    }
    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel
                            paragrafTittel="§15-4"
                            tittel="Mor eller Far"
                            vilkårsresultat={vurdering.resultat}
                        />
                        <MorEllerFarInfo
                            barnMedSamvær={grunnlag.barnMedSamvær}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />
                    </>
                ),
                høyre: (
                    <VisEllerEndreVurdering
                        vurdering={vurdering}
                        ikkeVurderVilkår={ikkeVurderVilkår}
                        feilmelding={feilmeldinger[vurdering.id]}
                        lagreVurdering={lagreVurdering}
                        nullstillVurdering={nullstillVurdering}
                    />
                ),
            }}
        </ToKolonnerLayout>
    );
};
