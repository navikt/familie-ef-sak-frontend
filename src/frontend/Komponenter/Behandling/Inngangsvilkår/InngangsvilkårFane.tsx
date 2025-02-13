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
import { Behandlingsårsak } from '../../../App/typer/behandlingsårsak';
import { FyllUtVilkårKnapp } from './FyllUtVilkårKnapp';
import VilkårIkkeOpprettetAlert from '../Vurdering/VilkårIkkeOpprettet';
import { Behandling } from '../../../App/typer/fagsak';
import { useApp } from '../../../App/context/AppContext';
import { InngangsvilkårHeader } from './InngangsvilkårHeader';
import { formaterIsoDatoTidMedSekunder } from '../../../App/utils/formatter';
import { useSamværsavtaler } from '../../../App/hooks/useSamværsavtaler';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

interface Props {
    behandling: Behandling;
}

export const InngangsvilkårFane: FC<Props> = ({ behandling }) => {
    const { toggles } = useToggles();
    const skalViseSamværskalkulator = toggles[ToggleName.visSamværskalkulator];
    const { behandlingErRedigerbar, vilkårState } = useBehandling();
    const { erSaksbehandler } = useApp();
    const {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
        ikkeVurderVilkår,
        oppdaterGrunnlagsdataOgHentVilkår,
    } = vilkårState;
    const { samværsavtaler, hentSamværsavtaler, lagreSamværsavtale, slettSamværsavtale } =
        useSamværsavtaler(skalViseSamværskalkulator);

    React.useEffect(() => {
        hentVilkår(behandling.id);
        if (skalViseSamværskalkulator) {
            hentSamværsavtaler(behandling.id);
        }
    }, [hentVilkår, hentSamværsavtaler, behandling.id, skalViseSamværskalkulator]);

    return (
        <DataViewer response={{ samværsavtaler, vilkår }}>
            {({ samværsavtaler, vilkår }) => {
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
                                behandlingId={behandling.id}
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
                            behandling={behandling}
                        />
                        <Aleneomsorg
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                            ikkeVurderVilkår={ikkeVurderVilkår}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                            behandling={behandling}
                            lagredeSamværsavtaler={samværsavtaler}
                            lagreSamværsavtale={lagreSamværsavtale}
                            slettSamværsavtale={slettSamværsavtale}
                        />
                    </>
                );
            }}
        </DataViewer>
    );
};
