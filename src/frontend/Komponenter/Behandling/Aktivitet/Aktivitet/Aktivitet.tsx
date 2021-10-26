import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import AktivitetInfo from './AktivitetInfo';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';

export const Aktivitet: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
}) => {
    const { behandling } = useBehandling();

    const vurdering = vurderinger.find((v) => v.vilkårType === AktivitetsvilkårType.AKTIVITET);
    if (!vurdering) {
        return <div>Mangler vurdering for aktivitet</div>;
    }
    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => {
                const skalSkjuleSøknadsdata = !!(
                    behandling.behandlingsårsak !== Behandlingsårsak.SØKNAD
                );

                return (
                    <ToKolonnerLayout>
                        {{
                            venstre: (
                                <>
                                    <Vilkårstittel
                                        tittel="Aktivitet"
                                        vilkårsresultat={vurdering.resultat}
                                    />
                                    <AktivitetInfo
                                        aktivitet={grunnlag.aktivitet}
                                        skalSkjuleSøknadsdata={skalSkjuleSøknadsdata}
                                    />
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
