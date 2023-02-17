import React, { FC, useEffect } from 'react';
import { RessursStatus } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { AktivitetArbeid } from './AktivitetArbeid/AktivitetArbeid';
import { Inntekt } from './Inntekt/Inntekt';
import { AlderPåBarn } from './AlderPåBarn/AlderPåBarn';
import { Behandling } from '../../../App/typer/fagsak';
import { DokumentasjonsTilsynsutgifter } from './DokumentasjonTilsynsutgifter/DokumentasjonsTilsynsutgifter';
import { useBehandling } from '../../../App/context/BehandlingContext';

const AktivitetsVilkårBarnetilsyn: FC<{
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

    const behandlingId = behandling.id;

    useEffect(() => {
        if (vilkår.status === RessursStatus.IKKE_HENTET) {
            hentVilkår(behandlingId);
        }
        // eslint-disable-next-line
    }, [behandlingId]);

    return (
        <DataViewer response={{ vilkår }}>
            {({ vilkår }) => {
                return (
                    <>
                        <AktivitetArbeid
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />

                        <Inntekt
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />

                        <AlderPåBarn
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />

                        <DokumentasjonsTilsynsutgifter
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
export default AktivitetsVilkårBarnetilsyn;
