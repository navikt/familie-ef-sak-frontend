import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import AktivitetInfo from './AktivitetInfo';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Behandlingsårsak } from '../../../../App/typer/behandlingsårsak';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';

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
        return (
            <AlertError>
                OBS: Noe er galt - det finnes ingen vilkår for aktivitet for denne behandlingen
            </AlertError>
        );
    }
    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => {
                const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;

                return (
                    <Vilkårpanel
                        tittel="Aktivitet"
                        vilkårsresultat={vurdering.resultat}
                        vilkår={vurdering.vilkårType}
                    >
                        <VilkårpanelInnhold>
                            {{
                                venstre: grunnlag.aktivitet && skalViseSøknadsdata && (
                                    <AktivitetInfo
                                        aktivitet={grunnlag.aktivitet}
                                        stønadstype={behandling.stønadstype}
                                        dokumentasjon={grunnlag.dokumentasjon}
                                    />
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
                        </VilkårpanelInnhold>
                    </Vilkårpanel>
                );
            }}
        </DataViewer>
    );
};
