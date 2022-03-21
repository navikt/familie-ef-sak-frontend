import React, { FC } from 'react';
import { RessursStatus } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentVilkår } from '../../../App/hooks/useHentVilkår';
import { NyttBarnSammePartner } from './NyttBarnSammePartner/NyttBarnSammePartner';
import { Aleneomsorg } from './Aleneomsorg/Aleneomsorg';
import { MorEllerFar } from './MorEllerFar/MorEllerFar';
import { Opphold } from './Opphold/Opphold';
import { Medlemskap } from './Medlemskap/Medlemskap';
import { Samliv } from './Samliv/Samliv';
import { Sivilstand } from './Sivilstand/Sivilstand';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { OppdaterOpplysninger } from './Medlemskap/OppdaterOpplysninger';
import { formaterIsoDatoTidMedSekunder } from '../../../App/utils/formatter';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

interface Props {
    behandlingId: string;
}

const Inngangsvilkår: FC<Props> = ({ behandlingId }) => {
    const {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
        ikkeVurderVilkår,
        oppdaterGrunnlagsdataOgHentVilkår,
    } = useHentVilkår();

    const { behandling, behandlingErRedigerbar } = useBehandling();
    const { toggles } = useToggles();

    React.useEffect(() => {
        if (behandlingId !== undefined) {
            if (vilkår.status !== RessursStatus.SUKSESS) {
                hentVilkår(behandlingId);
            }
        }
        // eslint-disable-next-line
    }, [behandlingId]);

    return (
        <DataViewer response={{ vilkår, behandling }}>
            {({ vilkår, behandling }) => {
                const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;
                const grunnlagsdataInnhentetDato = formaterIsoDatoTidMedSekunder(
                    vilkår.grunnlag.registeropplysningerOpprettetTid
                );

                return (
                    <>
                        {toggles[ToggleName.visOppdateringAvRegisteropplysninger] && (
                            <OppdaterOpplysninger
                                oppdatertDato={grunnlagsdataInnhentetDato}
                                behandlingErRedigerbar={behandlingErRedigerbar}
                                oppdaterGrunnlagsdata={oppdaterGrunnlagsdataOgHentVilkår}
                                behandlingId={behandlingId}
                            />
                        )}
                        <Medlemskap
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />
                        <Opphold
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />
                        <MorEllerFar
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />
                        <NyttBarnSammePartner
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />
                        <Sivilstand
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />
                        <Samliv
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />
                        <Aleneomsorg
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                            stønadstype={behandling.stønadstype}
                        />
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Inngangsvilkår;
