import React, { FC, useEffect } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Aktivitet } from './Aktivitet/Aktivitet';
import { SagtOppEllerRedusert } from './SagtOppEllerRedusert/SagtOppEllerRedusert';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { Behandling } from '../../../App/typer/fagsak';
import { useBehandling } from '../../../App/context/BehandlingContext';
import VilkårIkkeOpprettetAlert from '../Vurdering/VilkårIkkeOpprettet';

const AktivitetsVilkårOvergangsstønad: FC<{ behandling: Behandling }> = ({ behandling }) => {
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

    const behandlingId = behandling.id;
    useEffect(() => {
        hentVilkår(behandlingId);
        // eslint-disable-next-line
    }, [behandlingId]);

    return (
        <DataViewer response={{ vilkår }}>
            {({ vilkår }) => {
                return vilkår.vurderinger.length === 0 ? (
                    <VilkårIkkeOpprettetAlert />
                ) : (
                    <>
                        <Aktivitet
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />
                        <SagtOppEllerRedusert
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

export default AktivitetsVilkårOvergangsstønad;
