import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
//import AktivitetInfo from './AktivitetInfo';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';
//import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';

import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import AktivitetArbeidInfo from './AktivitetArbeidInfo';

export const AktivitetArbeid: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
}) => {
    const { behandling } = useBehandling();
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === AktivitetsvilkårType.AKTIVITET_ARBEID
    );

    console.log(
        'VURDERINGER: ',
        vurderinger,
        behandling,
        ikkeVurderVilkår,
        feilmeldinger,
        nullstillVurdering,
        lagreVurdering
    );

    console.log('GRUNNLAG: ', grunnlag);

    if (!vurdering) {
        return <></>;
        // return <div>Mangler vurdering for aktivitet - arbeid </div>;
    }

    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => {
                console.log(behandling);

                const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;

                return (
                    <ToKolonnerLayout>
                        {{
                            venstre: (
                                <>
                                    <>
                                        <Vilkårstittel
                                            tittel="Aktivitet arbeid"
                                            vilkårsresultat={vurdering.resultat}
                                            paragrafTittel={'§15-10'}
                                        />
                                        {grunnlag.aktivitet && (
                                            <AktivitetArbeidInfo
                                                aktivitet={grunnlag.aktivitet}
                                                skalViseSøknadsdata={skalViseSøknadsdata}
                                            />
                                        )}
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
            }}
        </DataViewer>
    );
};
