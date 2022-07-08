import React, { FC, useState } from 'react';
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
import { Alert } from '@navikt/ds-react';
import styled from 'styled-components';
import { Expand, Collapse } from '@navikt/ds-icons';
import { Normaltekst } from 'nav-frontend-typografi';
import LenkeKnapp from '../../../Felles/Knapper/LenkeKnapp';
import navFarger from 'nav-frontend-core';

interface Props {
    behandlingId: string;
}

const Alertstripe = styled(Alert)`
    margin-top: 1rem;
    margin-right: 2rem;
    margin-bottom: 1rem;
    width: 40rem;
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
`;

const InfoHeader = styled.div`
    display: grid;
    grid-template-columns: 26rem 2rem;
`;

const LenkeIkon = styled.div`
    top: 2px;
    display: inline-block;
    position: relative;
`;

const ForrigeBehandlingTabell = styled.table`
    margin-top: 1rem;
    margin-bottom: 1rem;
    width: 100%;
    border-collapse: collapse;
    font-size: 1rem;

    td,
    th {
        border-bottom: 1px solid ${navFarger.navGra40};
        padding: 0rem 2rem 0rem 0rem;
        text-align: left;
    }
`;

const Inngangsvilkår: FC<Props> = ({ behandlingId }) => {
    const [visForrigeBehandling, settVisForrigeBehandling] = useState<boolean>(false);
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
                const årsak = behandling.behandlingsårsak;
                const skalViseSøknadsdata =
                    årsak === Behandlingsårsak.SØKNAD || årsak === Behandlingsårsak.PAPIRSØKNAD;
                const grunnlagsdataInnhentetDato = formaterIsoDatoTidMedSekunder(
                    vilkår.grunnlag.registeropplysningerOpprettetTid
                );

                return (
                    <>
                        <Container>
                            <OppdaterOpplysninger
                                oppdatertDato={grunnlagsdataInnhentetDato}
                                behandlingErRedigerbar={behandlingErRedigerbar}
                                oppdaterGrunnlagsdata={oppdaterGrunnlagsdataOgHentVilkår}
                                behandlingId={behandlingId}
                            />
                            <Alertstripe variant={'info'} fullWidth={false}>
                                <InfoHeader>
                                    <LenkeKnapp
                                        onClick={() => {
                                            settVisForrigeBehandling((prevState) => !prevState);
                                        }}
                                        minWidth={'16px'}
                                    >
                                        <Normaltekst>
                                            Gjenbruk vurdering av inngangsvilkår fra forrige
                                            behandling?
                                        </Normaltekst>
                                    </LenkeKnapp>
                                    <LenkeKnapp
                                        onClick={() => {
                                            settVisForrigeBehandling((prevState) => !prevState);
                                        }}
                                        minWidth={'16px'}
                                    >
                                        <LenkeIkon>
                                            {visForrigeBehandling ? <Collapse /> : <Expand />}
                                        </LenkeIkon>
                                    </LenkeKnapp>
                                </InfoHeader>
                                {visForrigeBehandling && (
                                    <ForrigeBehandlingTabell>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <b>Stønadstype</b>
                                                </th>
                                                <th>
                                                    <b>Behandlingstype</b>
                                                </th>
                                                <th>
                                                    <b>Vedtaksdato</b>
                                                </th>
                                                <th>
                                                    <b>Vedtaksresultat</b>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Barnetilsyn</td>
                                                <td>Førstegangsbehandling</td>
                                                <td>01.04.2022</td>
                                                <td>Innvilget</td>
                                            </tr>
                                        </tbody>
                                    </ForrigeBehandlingTabell>
                                )}
                            </Alertstripe>
                        </Container>
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
