import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
//import AktivitetInfo from './AktivitetInfo';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';
//import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';

export const Inntekt: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
}) => {
    const { behandling } = useBehandling();
    console.log('INNTEKT (Aktivitetsvilkår) : ', grunnlag, behandling); // TODO trenger vi disse på dette vilkåret senere?
    const vurdering = vurderinger.find((v) => v.vilkårType === AktivitetsvilkårType.INNTEKT);

    if (!vurdering) {
        return <></>;
        //return <div>Mangler vurdering for inntekt</div>;
    }

    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <>
                            <Vilkårstittel
                                tittel="Inntekt"
                                vilkårsresultat={vurdering.resultat}
                                paragrafTittel={'§15-10'}
                            />
                        </>
                    </>
                ),
                høyre: (
                    <VisEllerEndreVurdering
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
};
