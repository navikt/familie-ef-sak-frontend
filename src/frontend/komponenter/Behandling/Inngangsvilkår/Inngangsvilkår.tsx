import React, { FC, useEffect, useState } from 'react';
import { InngangsvilkårGruppe, IVurdering, VilkårGruppe } from './vilkår';
import { Ressurs, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import styled from 'styled-components';
import Vurdering from '../Vurdering/Vurdering';
import { useHistory } from 'react-router';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { Knapp } from 'nav-frontend-knapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { useBehandling } from '../../../context/BehandlingContext';
import hiddenIf from '../../Felleskomponenter/HiddenIf/hiddenIf';
import { Behandling } from '../../../typer/fagsak';
import { VilkårStatusIkon } from '../../Felleskomponenter/Visning/VilkårOppfylt';
import { EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import { GridTabell } from '../../Felleskomponenter/Visning/StyledTabell';
import { vilkårStatusAleneomsorg } from '../Vurdering/VurderingUtil';
import { useHentVilkår } from '../../../hooks/useHentVilkår';

export const StyledInngangsvilkår = styled.div`
    margin: 2rem;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-auto-rows: auto;
    grid-gap: 3rem;
`;

export const StyledKnapp = hiddenIf(styled(Knapp)`
    display: block;
    margin: 2rem auto 0;
`);

interface Props {
    behandlingId: string;
}

const Inngangsvilkår: FC<Props> = ({ behandlingId }) => {
    const history = useHistory();
    const [postInngangsvilkårSuksess, settPostInngangsvilkårSuksess] = useState(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const { axiosRequest } = useApp();
    const { behandling, hentBehandling } = useBehandling();

    const { vilkår, hentVilkår, lagreVurdering, feilmeldinger, nullstillVurdering } = useHentVilkår(behandlingId);

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

    useEffect(() => {
        postInngangsvilkårSuksess && history.push(`/behandling/${behandlingId}/aktivitet`);
    }, [postInngangsvilkårSuksess]);

    const ferdigVurdert = (behandlingId: string): any => {
        const postInngangsvilkår = (): Promise<Ressurs<string>> => {
            return axiosRequest<any, any>({
                method: 'POST',
                url: `/familie-ef-sak/api/vurdering/${behandlingId}/vilkar/fullfor`,
            });
        };

        // TODO: Kun for dummy-flyt - må forbedres/omskrives
        postInngangsvilkår().then((responseInngangsvilkår) => {
            if (responseInngangsvilkår.status === RessursStatus.SUKSESS) {
                settPostInngangsvilkårSuksess(true);
                hentBehandling.rerun();
            } else if (
                responseInngangsvilkår.status === RessursStatus.IKKE_TILGANG ||
                responseInngangsvilkår.status === RessursStatus.FEILET ||
                responseInngangsvilkår.status === RessursStatus.FUNKSJONELL_FEIL
            ) {
                settPostInngangsvilkårSuksess(false);
                settFeilmelding(responseInngangsvilkår.frontendFeilmelding);
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
        <>
            {feilmelding && <AlertStripeFeil children={feilmelding} />}
            <StyledKnapp onClick={() => ferdigVurdert(behandlingId)}>Gå videre</StyledKnapp>
            <DataViewer response={{ vilkår }}>
                {({ vilkår }) => {
                    const harEndringerIGrunnlagsdata = Object.values(
                        (behandling as RessursSuksess<Behandling>).data
                            .endringerIRegistergrunnlag || {}
                    ).some((endringer) => endringer.length > 0);
                    return (
                        <StyledInngangsvilkår>
                            {Object.keys(InngangsvilkårGruppe).map((vilkårGruppe) => {
                                if (vilkårGruppe === InngangsvilkårGruppe.ALENEOMSORG) {
                                    return (
                                        <React.Fragment key={vilkårGruppe}>
                                            <VilkårStatusForAleneomsorg
                                                vurderinger={vilkår.vurderinger}
                                            />
                                            {vilkår.grunnlag.barnMedSamvær.map((barn) => {
                                                return (
                                                    <Vurdering
                                                        key={barn.barnId}
                                                        barnId={barn.barnId}
                                                        vilkårGruppe={vilkårGruppe}
                                                        inngangsvilkår={vilkår}
                                                        lagreVurdering={lagreVurdering}
                                                        feilmeldinger={feilmeldinger}
                                                        nullstillVurdering={nullstillVurdering}
                                                    />
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                } else {
                                    return (
                                        <Vurdering
                                            key={vilkårGruppe}
                                            vilkårGruppe={vilkårGruppe as InngangsvilkårGruppe}
                                            inngangsvilkår={vilkår}
                                            feilmeldinger={feilmeldinger}
                                            lagreVurdering={lagreVurdering}
                                            nullstillVurdering={nullstillVurdering}
                                        />
                                    );
                                }
                            })}
                            <StyledKnapp
                                onClick={godkjennEnderinger}
                                hidden={!harEndringerIGrunnlagsdata}
                            >
                                Godkjenn endringer i registergrunnlag
                            </StyledKnapp>
                        </StyledInngangsvilkår>
                    );
                }}
            </DataViewer>
        </>
    );
};
const VilkårStatusForAleneomsorg: React.FC<{ vurderinger: IVurdering[] }> = ({ vurderinger }) => {
    const status = vilkårStatusAleneomsorg(vurderinger);
    return (
        <GridTabell style={{ marginBottom: 0 }}>
            <VilkårStatusIkon className={'vilkårStatusIkon'} vilkårStatus={status} />
            <div className="tittel fjernSpacing">
                <Undertittel>Aleneomsorg</Undertittel>
                <EtikettLiten>§15-4</EtikettLiten>
            </div>
        </GridTabell>
    );
};

export default Inngangsvilkår;
