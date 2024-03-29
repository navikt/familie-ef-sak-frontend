import React, { FC } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { NyttBarnSammePartner } from './NyttBarnSammePartner/NyttBarnSammePartner';
import { Aleneomsorg } from './Aleneomsorg/Aleneomsorg';
import { MorEllerFar } from './MorEllerFar/MorEllerFar';
import { Opphold } from './Opphold/Opphold';
import { Medlemskap } from './Medlemskap/Medlemskap';
import { Samliv } from './Samliv/Samliv';
import { Sivilstand } from './Sivilstand/Sivilstand';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { formaterIsoDatoTidMedSekunder } from '../../../App/utils/formatter';
import { InngangsvilkårHeader } from './InngangsvilkårHeader/InngangsvilkårHeader';
import { useApp } from '../../../App/context/AppContext';
import { FyllUtVilkårKnapp } from './FyllUtVilkårKnapp';
import VilkårIkkeOpprettetAlert from '../Vurdering/VilkårIkkeOpprettet';

interface Props {
    behandlingId: string;
}

const Inngangsvilkår: FC<Props> = ({ behandlingId }) => {
    const { behandling, behandlingErRedigerbar, vilkårState } = useBehandling();
    const { erSaksbehandler } = useApp();
    const {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
        ikkeVurderVilkår,
        oppdaterGrunnlagsdataOgHentVilkår,
        gjenbrukInngangsvilkår,
    } = vilkårState;

    React.useEffect(() => {
        hentVilkår(behandlingId);
        // eslint-disable-next-line
    }, [behandlingId]);
    return (
        <DataViewer response={{ vilkår, behandling }}>
            {({ vilkår, behandling }) => {
                const årsak = behandling.behandlingsårsak;
                const skalViseSøknadsdata =
                    årsak === Behandlingsårsak.SØKNAD || årsak === Behandlingsårsak.PAPIRSØKNAD;
                const grunnlagsdataInnhentetDato = formaterIsoDatoTidMedSekunder(
                    vilkår.grunnlag.registeropplysningerOpprettetTid
                );

                return vilkår.vurderinger.length === 0 ? (
                    <VilkårIkkeOpprettetAlert />
                ) : (
                    <>
                        <FyllUtVilkårKnapp
                            behandling={behandling}
                            hentVilkår={hentVilkår}
                            behandlingErRedigerbar={behandlingErRedigerbar}
                        />
                        {erSaksbehandler && (
                            <InngangsvilkårHeader
                                oppdatertDato={grunnlagsdataInnhentetDato}
                                behandlingErRedigerbar={behandlingErRedigerbar}
                                oppdaterGrunnlagsdata={oppdaterGrunnlagsdataOgHentVilkår}
                                behandlingId={behandlingId}
                                behandling={behandling}
                                gjenbrukInngangsvilkår={gjenbrukInngangsvilkår}
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
                            behandlingId={behandlingId}
                            behandlingsstatus={behandling.status}
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
                            behandlingId={behandlingId}
                        />
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Inngangsvilkår;
