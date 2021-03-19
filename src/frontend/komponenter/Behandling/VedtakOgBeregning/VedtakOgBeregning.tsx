import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { GridTabell } from '../../Felleskomponenter/Visning/StyledTabell';
import { Hovedknapp } from 'nav-frontend-knapper';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { Select, Textarea } from 'nav-frontend-skjema';
import { formaterNullableIsoDato, formaterNullableMånedÅr } from '../../../utils/formatter';
import { Søknadsgrunnlag } from '../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ISøknadData } from '../../../typer/beregningssøknadsdata';
import { useApp } from '../../../context/AppContext';
import { useDataHenter } from '../../../hooks/felles/useDataHenter';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import { useHistory } from 'react-router-dom';
import { ModalAction, ModalType, useModal } from '../../../context/ModalContext';
import { EBehandlingResultat, IVedtak } from '../../../typer/vedtak';

interface Props {
    behandlingId: string;
}

const StyledSelect = styled(Select)`
    max-width: 200px;
`;

const StyledInntekt = styled.div`
    padding: 2rem;
`;

const StyledFeilmelding = styled(AlertStripeFeil)`
    margin-top: 2rem;
`;

const StyledAdvarsel = styled(AlertStripeAdvarsel)`
    margin-top: 2rem;
`;

const VedtakOgBeregning: FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const { modalDispatch } = useModal();
    const history = useHistory();
    const [resultatType, settResultatType] = useState<EBehandlingResultat>();
    const [periodeBegrunnelse, settPeriodeBegrunnelse] = useState<string>('');
    const [inntektBegrunnelse, settInntektBegrunnelse] = useState<string>('');
    const [feilmelding, settFeilmelding] = useState<string>('');

    const søknadDataConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/beregning/${behandlingId}/hent-soknad`,
        }),
        [behandlingId]
    );

    const søknadDataResponse: Ressurs<ISøknadData> = useDataHenter<ISøknadData, null>(
        søknadDataConfig
    );

    const lagBlankett = () => {
        resultatType &&
            axiosRequest<string, IVedtak>({
                method: 'POST',
                url: `/familie-ef-sak/api/beregning/${behandlingId}/lagre-vedtak`,
                data: {
                    resultatType,
                    periodeBegrunnelse,
                    inntektBegrunnelse,
                },
            }).then((res: Ressurs<string>) => {
                switch (res.status) {
                    case RessursStatus.SUKSESS:
                        history.push(`/behandling/${behandlingId}/blankett`);
                        break;
                    case RessursStatus.HENTER:
                    case RessursStatus.IKKE_HENTET:
                        break;
                    default:
                        settFeilmelding(res.frontendFeilmelding);
                }
            });
    };

    const behandleIGosys = () => {
        axiosRequest<{ id: string }, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/annuller`,
        }).then((res: Ressurs<{ id: string }>) => {
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    modalDispatch({
                        type: ModalAction.VIS_MODAL,
                        modalType: ModalType.BEHANDLES_I_GOSYS,
                    });
                    break;
                case RessursStatus.HENTER:
                case RessursStatus.IKKE_HENTET:
                    break;
                default:
                    settFeilmelding(res.frontendFeilmelding);
            }
        });
    };

    const vedtaksresultatSwitch: React.FC<EBehandlingResultat> = (
        vedtaksresultatType: EBehandlingResultat
    ) => {
        switch (vedtaksresultatType) {
            case EBehandlingResultat.INNVILGE:
                return (
                    <>
                        <Element style={{ marginBottom: '1rem', marginTop: '3rem' }}>
                            Vedtaksperiode
                        </Element>
                        <Textarea
                            value={periodeBegrunnelse}
                            onChange={(e) => {
                                settPeriodeBegrunnelse(e.target.value);
                            }}
                            label="Begrunnelse"
                        />
                        <Element style={{ marginBottom: '1rem', marginTop: '3rem' }}>
                            Inntekt
                        </Element>
                        <Textarea
                            value={inntektBegrunnelse}
                            onChange={(e) => {
                                settInntektBegrunnelse(e.target.value);
                            }}
                            label="Begrunnelse"
                        />
                        <Hovedknapp style={{ marginTop: '2rem' }} onClick={lagBlankett}>
                            Lag blankett
                        </Hovedknapp>
                    </>
                );
            case EBehandlingResultat.BEHANDLE_I_GOSYS:
                return (
                    <>
                        <StyledAdvarsel>Oppgaven annulleres og må fullføres i Gosys</StyledAdvarsel>
                        <Hovedknapp style={{ marginTop: '2rem' }} onClick={behandleIGosys}>
                            Avslutt og behandle i Gosys
                        </Hovedknapp>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <DataViewer response={{ søknadDataResponse }}>
            {({ søknadDataResponse }) => {
                return (
                    <StyledInntekt>
                        <Element style={{ marginBottom: '0.5rem' }}>Søknadsinformasjon</Element>
                        <GridTabell style={{ marginBottom: '2rem' }}>
                            <Søknadsgrunnlag />
                            <Normaltekst>Søknadsdato</Normaltekst>
                            <Normaltekst>
                                {formaterNullableIsoDato(søknadDataResponse.søknadsdato)}
                            </Normaltekst>
                            <Søknadsgrunnlag />
                            <Normaltekst>Søker stønad fra</Normaltekst>
                            <Normaltekst>
                                {formaterNullableMånedÅr(søknadDataResponse.søkerStønadFra)}
                            </Normaltekst>
                        </GridTabell>
                        <StyledSelect
                            label="Vedtak"
                            value={resultatType}
                            onChange={(e) => {
                                settFeilmelding('');
                                settResultatType(e.target.value as EBehandlingResultat);
                            }}
                        >
                            <option value="">Velg</option>
                            <option value={EBehandlingResultat.INNVILGE}>Innvilge</option>
                            <option value={EBehandlingResultat.AVSLÅ} disabled>
                                Avslå
                            </option>
                            <option value={EBehandlingResultat.HENLEGGE} disabled>
                                Henlegge
                            </option>
                            <option value={EBehandlingResultat.BEHANDLE_I_GOSYS}>
                                Behandle i Gosys
                            </option>
                        </StyledSelect>
                        {resultatType && vedtaksresultatSwitch(resultatType)}
                        {feilmelding && <StyledFeilmelding>{feilmelding}</StyledFeilmelding>}
                    </StyledInntekt>
                );
            }}
        </DataViewer>
    );
};

export default VedtakOgBeregning;
