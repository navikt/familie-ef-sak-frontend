import React, { FC, useEffect } from 'react';
import { RessursStatus } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentVilkår } from '../../../App/hooks/useHentVilkår';
import { Aktivitet } from './Aktivitet/Aktivitet';
import { SagtOppEllerRedusert } from './SagtOppEllerRedusert/SagtOppEllerRedusert';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { AktivitetArbeid } from './AktivitetArbeid/AktivitetArbeid';
import { Inntekt } from './Inntekt/Inntekt';
import { AlderPåBarn } from './AlderPåBarn/AlderPåBarn';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { IVilkår } from '../Inngangsvilkår/vilkår';
import { Behandling } from '../../../App/typer/fagsak';

interface Props {
    behandlingId: string;
}

const AktivitetsVilkår: FC<Props> = ({ behandlingId }) => {
    const { vilkår, hentVilkår } = useHentVilkår();
    const { behandling } = useBehandling();

    useEffect(() => {
        if (behandlingId !== undefined) {
            if (vilkår.status !== RessursStatus.SUKSESS) {
                hentVilkår(behandlingId);
            }
        }
        // eslint-disable-next-line
    }, [behandlingId]);

    return (
        <DataViewer response={{ behandling, vilkår }}>
            {({ behandling, vilkår }) => {
                switch (behandling.stønadstype) {
                    case Stønadstype.OVERGANGSSTØNAD:
                        return <AktivitetOvergangsstønad vilkår={vilkår} behandling={behandling} />;
                    case Stønadstype.BARNETILSYN:
                        return <AktivitetBarnetilsyn vilkår={vilkår} behandling={behandling} />;
                    case Stønadstype.SKOLEPENGER:
                        return null;
                }
            }}
        </DataViewer>
    );
};

const AktivitetOvergangsstønad: FC<{ vilkår: IVilkår; behandling: Behandling }> = ({
    vilkår,
    behandling,
}) => {
    const { lagreVurdering, feilmeldinger, nullstillVurdering, ikkeVurderVilkår } = useHentVilkår();
    const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;
    return (
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
};

const AktivitetBarnetilsyn: FC<{ vilkår: IVilkår; behandling: Behandling }> = ({
    vilkår,
    behandling,
}) => {
    const { lagreVurdering, feilmeldinger, nullstillVurdering, ikkeVurderVilkår } = useHentVilkår();
    const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;
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
        </>
    );
};
export default AktivitetsVilkår;
