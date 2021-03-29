import React, { FC, useState } from 'react';
import { InngangsvilkårType, IVurdering, Vilkårsresultat } from './vilkår';
import { RessursStatus, RessursSuksess } from '../../../typer/ressurs';
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
import { VilkårsresultatIkon } from '../../Felleskomponenter/Visning/VilkårOppfylt';
import { EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import { useHentVilkår } from '../../../hooks/useHentVilkår';
import Vilkår from '../../Felleskomponenter/Vilkår';
import { vilkårStatusAleneomsorg } from '../Vurdering/VurderingUtil';
import { GridTabell } from '../../Felleskomponenter/Visning/StyledTabell';
import NyttBarnSammePartnerVisning from './NyttBarnSammePartner/NyttBarnSammePartnerVisning';

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
    const [feilmelding, settFeilmelding] = useState<string>();
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
        <>
            {feilmelding && <AlertStripeFeil children={feilmelding} />}
            <DataViewer response={{ vilkår }}>
                {({ vilkår }) => {
                    const harEndringerIGrunnlagsdata = Object.values(
                        (behandling as RessursSuksess<Behandling>).data
                            .endringerIRegistergrunnlag || {}
                    ).some((endringer) => endringer.length > 0);
                    return (
                        <>
                            <Vilkår
                                tittel="Nytt barn samme partner"
                                vilkårsresultat={
                                    vilkår.vurderinger.find(
                                        (v) =>
                                            v.vilkårType ===
                                            InngangsvilkårType.NYTT_BARN_SAMME_PARTNER
                                    )!.resultat ?? Vilkårsresultat.IKKE_TATT_STILLING_TIL
                                }
                            >
                                {{
                                    left: (
                                        <NyttBarnSammePartnerVisning
                                            barnMedSamvær={vilkår.grunnlag.barnMedSamvær}
                                            vilkårsresultat={
                                                vilkår.vurderinger.find(
                                                    (v) =>
                                                        v.vilkårType ===
                                                        InngangsvilkårType.NYTT_BARN_SAMME_PARTNER
                                                )!.resultat ??
                                                Vilkårsresultat.IKKE_TATT_STILLING_TIL
                                            }
                                        />
                                    ),
                                    right: <div>vurdering</div>,
                                }}
                            </Vilkår>
                            <StyledInngangsvilkår>
                                {Object.keys(InngangsvilkårType).map((vilkårGruppe) => {
                                    if (vilkårGruppe === InngangsvilkårType.ALENEOMSORG) {
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
                                                vilkårGruppe={vilkårGruppe as InngangsvilkårType}
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
                        </>
                    );
                }}
            </DataViewer>
        </>
    );
};
const VilkårStatusForAleneomsorg: React.FC<{ vurderinger: IVurdering[] }> = ({ vurderinger }) => {
    const vilkårsresultat = vilkårStatusAleneomsorg(vurderinger);
    return (
        <GridTabell style={{ marginBottom: 0 }}>
            <VilkårsresultatIkon className={'vilkårStatusIkon'} vilkårsresultat={vilkårsresultat} />
            <div className="tittel fjernSpacing">
                <Undertittel>Aleneomsorg</Undertittel>
                <EtikettLiten>§15-4</EtikettLiten>
            </div>
        </GridTabell>
    );
};

export default Inngangsvilkår;
