import React, { FC, useEffect, useState } from 'react';
import { Ressurs, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import Vurdering from '../Vurdering/Vurdering';
import { useHistory } from 'react-router';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { useBehandling } from '../../../context/BehandlingContext';
import { Behandling } from '../../../typer/fagsak';
import { useHentVilkår } from '../../../hooks/useHentVilkår';
import { StyledInngangsvilkår, StyledKnapp } from '../Inngangsvilkår/Inngangsvilkår';
import { AktivitetsvilkårType } from '../Inngangsvilkår/vilkår';

interface Props {
    behandlingId: string;
}

const Aktivitet: FC<Props> = ({ behandlingId }) => {
    const history = useHistory();
    const [postOvergangsstønadSuksess, settPostOvergangsstønadSuksess] = useState(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const { axiosRequest } = useApp();
    const { behandling, hentBehandling } = useBehandling();

    const { vilkår, hentVilkår, lagreVurdering, feilmeldinger, nullstillVurdering } = useHentVilkår(
        behandlingId
    );

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
        postOvergangsstønadSuksess &&
            history.push(`/behandling/${behandlingId}/vedtak-og-beregning`);
    }, [postOvergangsstønadSuksess]);

    const ferdigVurdert = (behandlingId: string): any => {
        const postOvergangsstønad = (): Promise<Ressurs<string>> => {
            return axiosRequest<any, any>({
                method: 'POST',
                url: `/familie-ef-sak/api/vurdering/${behandlingId}/overgangsstonad/fullfor`,
            });
        };

        // TODO: Kun for dummy-flyt - må forbedres/omskrives
        postOvergangsstønad().then((responseStønadsvilkår) => {
            if (responseStønadsvilkår.status === RessursStatus.SUKSESS) {
                settPostOvergangsstønadSuksess(true);
            } else if (
                responseStønadsvilkår.status === RessursStatus.IKKE_TILGANG ||
                responseStønadsvilkår.status === RessursStatus.FEILET ||
                responseStønadsvilkår.status === RessursStatus.FUNKSJONELL_FEIL
            ) {
                settPostOvergangsstønadSuksess(false);
                settFeilmelding(responseStønadsvilkår.frontendFeilmelding);
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
                            {Object.keys(AktivitetsvilkårType).map((vilkårGruppe) => {
                                return (
                                    <Vurdering
                                        key={vilkårGruppe}
                                        vilkårGruppe={vilkårGruppe as AktivitetsvilkårType}
                                        inngangsvilkår={vilkår}
                                        feilmeldinger={feilmeldinger}
                                        lagreVurdering={lagreVurdering}
                                        nullstillVurdering={nullstillVurdering}
                                    />
                                );
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

export default Aktivitet;
