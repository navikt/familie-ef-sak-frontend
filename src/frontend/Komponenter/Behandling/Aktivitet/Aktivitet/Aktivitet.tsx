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
        return <></>;
        // return <div>Mangler vurdering for aktivitet</div>;
    }
    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => {
                const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;

                return (
                    <ToKolonnerLayout>
                        {{
                            venstre: (
                                <>
                                    <Vilkårstittel
                                        tittel="Aktivitet"
                                        vilkårsresultat={vurdering.resultat}
                                    />
                                    {grunnlag.aktivitet && (
                                        <AktivitetInfo
                                            aktivitet={grunnlag.aktivitet}
                                            skalViseSøknadsdata={skalViseSøknadsdata}
                                            stønadstype={behandling.stønadstype}
                                        />
                                    )}
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
