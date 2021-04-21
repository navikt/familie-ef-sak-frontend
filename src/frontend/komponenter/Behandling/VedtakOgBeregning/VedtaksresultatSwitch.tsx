import React, { Dispatch, SetStateAction, useState } from 'react';
import { EBehandlingResultat, IValideringsfeil, IVedtak } from '../../../typer/vedtak';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import { ModalAction, ModalType, useModal } from '../../../context/ModalContext';
import styled from 'styled-components';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { useHistory } from 'react-router-dom';
import { Calculator } from '@navikt/ds-icons';
import { useBehandling } from '../../../context/BehandlingContext';
import { validerVedtaksperioder } from './vedtaksvalidering';
import InntektsperiodeValg, {
    IInntektsperiodeData,
    tomInntektsperiodeRad,
} from './InntektsperiodeValg';
import VedtaksperiodeValg, {
    IVedtaksperiodeData,
    tomVedtaksperiodeRad,
} from './VedtaksperiodeValg';

interface Props {
    vedtaksresultatType: EBehandlingResultat;
    behandlingId: string;
    settFeilmelding: Dispatch<SetStateAction<string>>;
    lagretVedtak?: IVedtak;
}

const StyledAdvarsel = styled(AlertStripeAdvarsel)`
    margin-top: 2rem;
`;

const KnappMedMargin = styled(Knapp)`
    margin-bottom: 1rem;
    margin-top: 1rem;
`;

const VedtaksresultatSwitch: React.FC<Props> = (props: Props) => {
    const { axiosRequest } = useApp();
    const { modalDispatch } = useModal();
    const { hentBehandling } = useBehandling();
    const history = useHistory();
    const { vedtaksresultatType, behandlingId, settFeilmelding, lagretVedtak } = props;

    const [valideringsfeil, settValideringsfeil] = useState<IValideringsfeil>({
        vedtaksperioder: [],
        inntektsperioder: [],
    });

    const [vedtaksperiodeData, settVedtaksperiodeData] = useState<IVedtaksperiodeData>({
        periodeBegrunnelse: lagretVedtak?.periodeBegrunnelse || '',
        vedtaksperiodeListe: lagretVedtak ? lagretVedtak.perioder : [tomVedtaksperiodeRad],
    });

    const [inntektsperiodeData, settInntektsperiodeData] = useState<IInntektsperiodeData>({
        inntektBegrunnelse: lagretVedtak?.inntektBegrunnelse || '',
        inntektsperiodeListe: lagretVedtak?.periodeInntekt
            ? lagretVedtak?.periodeInntekt
            : [tomInntektsperiodeRad],
        visSamordning:
            lagretVedtak?.periodeInntekt?.some(
                (el) => el.samordningsfradrag && el.samordningsfradrag > 0
            ) || false,
    });

    const [laster, settLaster] = useState<boolean>(false);

    const validerVedtak = (): boolean => {
        const validerteVedtaksperioder = validerVedtaksperioder(
            inntektsperiodeData.inntektsperiodeListe,
            vedtaksperiodeData.vedtaksperiodeListe
        );
        settValideringsfeil(validerteVedtaksperioder);
        return (
            validerteVedtaksperioder.vedtaksperioder.length === 0 &&
            validerteVedtaksperioder.inntektsperioder.length === 0
        );
    };

    const beregnPerioder = () => {
        // api-kall og oppdater beregnede perioder
    };

    const lagBlankett = () => {
        settLaster(true);
        axiosRequest<string, IVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandlingId}/lagre-vedtak`,
            data: {
                resultatType: vedtaksresultatType,
                periodeBegrunnelse: vedtaksperiodeData.periodeBegrunnelse,
                inntektBegrunnelse: inntektsperiodeData.inntektBegrunnelse,
                perioder: vedtaksperiodeData.vedtaksperiodeListe,
                periodeInntekt: inntektsperiodeData.inntektsperiodeListe,
            },
        })
            .then((res: Ressurs<string>) => {
                switch (res.status) {
                    case RessursStatus.SUKSESS:
                        history.push(`/behandling/${behandlingId}/blankett`);
                        hentBehandling.rerun();
                        break;
                    case RessursStatus.HENTER:
                    case RessursStatus.IKKE_HENTET:
                        break;
                    default:
                        settFeilmelding(res.frontendFeilmelding);
                }
            })
            .finally(() => {
                settLaster(false);
            });
    };

    const behandleIGosys = () => {
        settLaster(true);
        axiosRequest<{ id: string }, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/annuller`,
        })
            .then((res: Ressurs<{ id: string }>) => {
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
            })
            .finally(() => {
                settLaster(false);
            });
    };
    switch (vedtaksresultatType) {
        case EBehandlingResultat.INNVILGE:
            return (
                <>
                    <VedtaksperiodeValg
                        vedtaksperiodeData={vedtaksperiodeData}
                        settVedtaksperiodeData={settVedtaksperiodeData}
                        valideringsfeil={valideringsfeil.vedtaksperioder}
                    />
                    <InntektsperiodeValg
                        inntektsperiodeData={inntektsperiodeData}
                        settInntektsperiodeData={settInntektsperiodeData}
                        valideringsfeil={valideringsfeil.inntektsperioder}
                    />
                    <div>
                        <KnappMedMargin onClick={beregnPerioder}>
                            <Calculator style={{ marginRight: '1rem' }} />
                            Beregn stønadsbeløp
                        </KnappMedMargin>
                    </div>
                    <Hovedknapp
                        style={{ marginTop: '2rem' }}
                        onClick={() => {
                            if (validerVedtak()) {
                                lagBlankett();
                            }
                        }}
                        disabled={laster}
                    >
                        Lagre vedtak
                    </Hovedknapp>
                </>
            );
        case EBehandlingResultat.BEHANDLE_I_GOSYS:
            return (
                <>
                    <StyledAdvarsel>Oppgaven annulleres og må fullføres i Gosys</StyledAdvarsel>
                    <Hovedknapp
                        style={{ marginTop: '2rem' }}
                        onClick={behandleIGosys}
                        disabled={laster}
                    >
                        Avslutt og behandle i Gosys
                    </Hovedknapp>
                </>
            );
        default:
            return null;
    }
};

export default VedtaksresultatSwitch;
