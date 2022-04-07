import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';

import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import AktivitetArbeidInfo from './AktivitetArbeidInfo';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

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

    if (!vurdering) {
        return (
            <AlertStripeFeil>
                OBS: Noe er galt - det finnes ingen vilkår for aktivitet for denne behandlingen
            </AlertStripeFeil>
        );
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
                                        paragrafTittel={'§15-10'}
                                    />
                                    {grunnlag.aktivitet && (
                                        <AktivitetArbeidInfo
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
