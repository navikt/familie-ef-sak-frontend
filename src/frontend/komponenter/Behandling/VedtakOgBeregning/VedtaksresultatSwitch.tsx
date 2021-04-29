import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    EBehandlingResultat,
    IBeløpsperiode,
    IBeregningsrequest,
    IValideringsfeil,
    IVedtak,
} from '../../../typer/vedtak';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
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
import { v4 as uuidv4 } from 'uuid';
import { Behandling } from '../../../typer/fagsak';
import { Behandlingstype } from '../../../typer/behandlingstype';

interface Props {
    vedtaksresultatType: EBehandlingResultat;
    behandling: Behandling;
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
    const { vedtaksresultatType, behandling, settFeilmelding, lagretVedtak } = props;
    const behandlingId = behandling.id;
    const [beregnetStønad, settBeregnetStønad] = useState<Ressurs<IBeløpsperiode[]>>(
        byggTomRessurs()
    );
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
        inntektsperiodeListe: lagretVedtak?.inntekter
            ? lagretVedtak?.inntekter
            : [tomInntektsperiodeRad],
    });

    const oppdaterVedtaksperiodeData = (verdi: IVedtaksperiodeData) => {
        const førsteVedtaksperiode = verdi.vedtaksperiodeListe[0];
        const førsteInntektsperiode =
            inntektsperiodeData.inntektsperiodeListe.length > 0 &&
            inntektsperiodeData.inntektsperiodeListe[0];
        settVedtaksperiodeData(verdi);
        if (
            førsteInntektsperiode &&
            førsteVedtaksperiode.årMånedFra !== førsteInntektsperiode.årMånedFra
        ) {
            settÅrMånedFraPåFørsteInntektsperiode(førsteVedtaksperiode.årMånedFra);
        }
    };

    const settÅrMånedFraPåFørsteInntektsperiode = (årMånedFra: string | undefined) => {
        settInntektsperiodeData({
            ...inntektsperiodeData,
            inntektsperiodeListe: inntektsperiodeData.inntektsperiodeListe.map((periode, index) => {
                return index === 0
                    ? {
                          ...periode,
                          årMånedFra: årMånedFra,
                          endretKey: uuidv4(),
                      }
                    : periode;
            }),
        });
    };

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
        axiosRequest<IBeløpsperiode[], IBeregningsrequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/`,
            data: {
                vedtaksperioder: vedtaksperiodeData.vedtaksperiodeListe,
                inntekt: inntektsperiodeData.inntektsperiodeListe.map((v) => ({
                    ...v,
                    forventetInntekt: v.forventetInntekt ?? 0,
                    samordningsfradrag: v.samordningsfradrag ?? 0,
                })),
            },
        }).then((res: Ressurs<IBeløpsperiode[]>) => settBeregnetStønad(res));
    };

    function lagVedtaksRequest() {
        return {
            resultatType: vedtaksresultatType,
            periodeBegrunnelse: vedtaksperiodeData.periodeBegrunnelse,
            inntektBegrunnelse: inntektsperiodeData.inntektBegrunnelse,
            perioder: vedtaksperiodeData.vedtaksperiodeListe,
            inntekter: inntektsperiodeData.inntektsperiodeListe,
        };
    }

    const håndterVedtaksresultat = (nesteUrl: string) => {
        return (res: Ressurs<string>) => {
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    history.push(nesteUrl);
                    hentBehandling.rerun();
                    break;
                case RessursStatus.HENTER:
                case RessursStatus.IKKE_HENTET:
                    break;
                default:
                    settFeilmelding(res.frontendFeilmelding);
            }
        };
    };

    const lagBlankett = () => {
        settLaster(true);
        axiosRequest<string, IVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandlingId}/lagre-vedtak`,
            data: lagVedtaksRequest(),
        })
            .then(håndterVedtaksresultat(`/behandling/${behandlingId}/blankett`))
            .finally(() => {
                settLaster(false);
            });
    };

    const lagreVedtak = () => {
        settLaster(true);
        axiosRequest<string, IVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandlingId}/fullfor`,
            data: lagVedtaksRequest(),
        })
            .then(håndterVedtaksresultat(`/behandling/${behandlingId}/brev`))
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
                        settVedtaksperiodeData={oppdaterVedtaksperiodeData}
                        valideringsfeil={valideringsfeil.vedtaksperioder}
                    />
                    <InntektsperiodeValg
                        inntektsperiodeData={inntektsperiodeData}
                        settInntektsperiodeData={settInntektsperiodeData}
                        beregnetStønad={beregnetStønad}
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
                                switch (behandling.type) {
                                    case Behandlingstype.BLANKETT:
                                        lagBlankett();
                                        break;
                                    case Behandlingstype.FØRSTEGANGSBEHANDLING:
                                        lagreVedtak();
                                        break;
                                    case Behandlingstype.REVURDERING:
                                        throw Error(
                                            'Støtter ikke behandlingstype revurdering ennå...'
                                        );
                                }
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
