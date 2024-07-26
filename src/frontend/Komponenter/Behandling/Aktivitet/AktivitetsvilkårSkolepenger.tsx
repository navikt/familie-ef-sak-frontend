import React, { FC, useEffect } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { Behandling } from '../../../App/typer/fagsak';
import { RettTilOvergangsstønad } from './Skolepenger/RettTilOvergangsstønad';
import { DokumentasjonUtdanning } from './Skolepenger/DokumentasjonUtdanning';
import { UtdanningHensiktsmessig } from './Skolepenger/UtdanningHensiktsmessig';
import { useBehandling } from '../../../App/context/BehandlingContext';
import VilkårIkkeOpprettetAlert from '../Vurdering/VilkårIkkeOpprettet';

const AktivitetsVilkårSkolepenger: FC<{
    behandling: Behandling;
}> = ({ behandling }) => {
    const { vilkårState } = useBehandling();
    const {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
        ikkeVurderVilkår,
    } = vilkårState;
    const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;

    useEffect(() => {
        hentVilkår(behandling.id);
    }, [hentVilkår, behandling.id]);

    return (
        <DataViewer response={{ vilkår }}>
            {({ vilkår }) => {
                return vilkår.vurderinger.length === 0 ? (
                    <VilkårIkkeOpprettetAlert />
                ) : (
                    <>
                        <RettTilOvergangsstønad
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            skalViseSøknadsdata={false}
                            behandling={behandling}
                        />
                        <DokumentasjonUtdanning
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />
                        <UtdanningHensiktsmessig
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />
                    </>
                );
            }}
        </DataViewer>
    );
};
export default AktivitetsVilkårSkolepenger;
