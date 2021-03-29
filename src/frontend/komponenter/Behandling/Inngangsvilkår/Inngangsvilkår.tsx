import React, { FC } from 'react';
import { RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { Knapp } from 'nav-frontend-knapper';
import { useBehandling } from '../../../context/BehandlingContext';
import hiddenIf from '../../Felleskomponenter/HiddenIf/hiddenIf';
import { Behandling } from '../../../typer/fagsak';
import { useHentVilkår } from '../../../hooks/useHentVilkår';
import { NyttBarnSammePartner } from './NyttBarnSammePartner/NyttBarnSammePartner';
import { Aleneomsorg } from './Aleneomsorg/Aleneomsorg';
import { MorEllerFar } from './MorEllerFar/MorEllerFar';
import { Opphold } from './Opphold/Opphold';
import { Medlemskap } from './Medlemskap/Medlemskap';
import { Samliv } from './Samliv/Samliv';
import { Sivilstand } from './Sivilstand/Sivilstand';

export const StyledInngangsvilkår = styled.div`
    margin: 2rem;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-auto-rows: auto;
    grid-gap: 3rem;
`;

export const StyledKnapp = styled(hiddenIf(Knapp))`
    display: block;
    margin: 2rem auto 0;
`;

interface Props {
    behandlingId: string;
}

const Inngangsvilkår: FC<Props> = ({ behandlingId }) => {
    const history = useHistory();
    const { axiosRequest } = useApp();
    const { behandling, hentBehandling } = useBehandling();

    const {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
    } = useHentVilkår();

    const godkjennEnderinger = () => {
        axiosRequest<null, void>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/registergrunnlag/godkjenn`,
        }).then((resp) => {
            if (resp.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
            }
        });
    };

    React.useEffect(() => {
        if (behandlingId !== undefined) {
            if (vilkår.status !== RessursStatus.SUKSESS) {
                hentVilkår(behandlingId);
            }
        }
    }, [behandlingId]);
    return (
        <DataViewer response={{ vilkår }}>
            {({ vilkår }) => {
                const harEndringerIGrunnlagsdata = Object.values(
                    (behandling as RessursSuksess<Behandling>).data.endringerIRegistergrunnlag || {}
                ).some((endringer) => endringer.length > 0);
                return (
                    <>
                        <Medlemskap
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                        />
                        <Opphold
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                        />
                        <Sivilstand
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                        />
                        <Samliv
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                        />
                        <NyttBarnSammePartner
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                        />
                        <MorEllerFar
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                        />
                        <Aleneomsorg
                            nullstillVurdering={nullstillVurdering}
                            feilmeldinger={feilmeldinger}
                            grunnlag={vilkår.grunnlag}
                            lagreVurdering={lagreVurdering}
                            vurderinger={vilkår.vurderinger}
                        />
                        <StyledKnapp
                            onClick={godkjennEnderinger}
                            hidden={!harEndringerIGrunnlagsdata}
                        >
                            Godkjenn endringer i registergrunnlag
                        </StyledKnapp>
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Inngangsvilkår;
