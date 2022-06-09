import React, { FC, useEffect } from 'react';
import { RessursStatus } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentVilkår } from '../../../App/hooks/useHentVilkår';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { Behandling } from '../../../App/typer/fagsak';
import { RettTilOvergangsstønad } from './Skolepenger/RettTilOvergangsstønad';
import { DokumentasjonUtdanning } from './Skolepenger/DokumentasjonUtdanning';
import { UtdanningHensiktsmessig } from './Skolepenger/UtdanningHensiktsmessig';

const AktivitetsVilkårSkolepenger: FC<{
    behandling: Behandling;
}> = ({ behandling }) => {
    const {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
        ikkeVurderVilkår,
    } = useHentVilkår();
    const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;
    const behandlingId = behandling.id;

    useEffect(() => {
        if (behandlingId !== undefined) {
            if (vilkår.status !== RessursStatus.SUKSESS) {
                hentVilkår(behandlingId);
            }
        }
        // eslint-disable-next-line
    }, [behandlingId]);

    return (
        <DataViewer response={{ vilkår }}>
            {({ vilkår }) => {
                return (
                    <>
                        <RettTilOvergangsstønad
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            skalViseSøknadsdata={false}
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
