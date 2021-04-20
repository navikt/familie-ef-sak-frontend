import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    EAktivitet,
    EBehandlingResultat,
    EInntektsperiodeProperty,
    EPeriodeProperty,
    EPeriodetype,
    IInntektsperiode,
    IValideringsfeil,
    IVedtak,
    IVedtaksperiode,
} from '../../../typer/vedtak';
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
import InntektsperiodeValg from './InntektsperiodeValg';
import VedtaksperiodeValg from './VedtaksperiodeValg';

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

    const [visSamordning, settVisSamordning] = useState<boolean>(
        lagretVedtak?.periodeInntekt?.some(
            (el) => el.samordningsfradrag && el.samordningsfradrag > 0
        ) || false
    );

    const [periodeBegrunnelse, settPeriodeBegrunnelse] = useState<string>(
        lagretVedtak?.periodeBegrunnelse || ''
    );
    const [inntektBegrunnelse, settInntektBegrunnelse] = useState<string>(
        lagretVedtak?.inntektBegrunnelse || ''
    );
    const [laster, settLaster] = useState<boolean>(false);
    const tomVedtaksperiodeRad = {
        periodeType: '' as EPeriodetype,
        aktivitet: '' as EAktivitet,
    };

    const tomInntektsperiodeRad: IInntektsperiode = {
        årMånedFra: '',
        forventetInntekt: undefined,
    };

    const validerVedtak = (): boolean => {
        const validerteVedtaksperioder = validerVedtaksperioder(
            inntektsperiodeListe,
            vedtaksperiodeListe
        );
        settValideringsfeil(validerteVedtaksperioder);
        return (
            validerteVedtaksperioder.vedtaksperioder.length === 0 &&
            validerteVedtaksperioder.inntektsperioder.length === 0
        );
    };

    const [vedtaksperiodeListe, settVedtaksperiodeListe] = useState<IVedtaksperiode[]>(
        lagretVedtak ? lagretVedtak.perioder : [tomVedtaksperiodeRad]
    );

    const [inntektsperiodeListe, settInntektsperiodeListe] = useState<IInntektsperiode[]>(
        lagretVedtak && lagretVedtak.periodeInntekt
            ? lagretVedtak.periodeInntekt
            : [tomInntektsperiodeRad]
    );

    const leggTilInntektsperiode = () => {
        settInntektsperiodeListe([...inntektsperiodeListe, tomInntektsperiodeRad]);
    };

    const fjernInntektsperiode = () => {
        const nyListe = [...inntektsperiodeListe];

        nyListe.pop();

        settInntektsperiodeListe(nyListe);
    };

    const oppdaterInntektslisteElement = (
        index: number,
        property: EInntektsperiodeProperty,
        value: string | number | undefined
    ) => {
        const oppdatertListe = inntektsperiodeListe.map((inntektsperiode, i) => {
            if (i === index) {
                return { ...inntektsperiode, [property]: value };
            }

            return inntektsperiode;
        });

        settInntektsperiodeListe(oppdatertListe);
    };

    const beregnPerioder = () => {
        // api-kall og oppdater beregnede perioder
    };

    const leggTilVedtaksperiode = () => {
        settVedtaksperiodeListe([...vedtaksperiodeListe, tomVedtaksperiodeRad]);
    };

    const fjernVedtaksperiode = () => {
        const nyListe = [...vedtaksperiodeListe];

        nyListe.pop();

        settVedtaksperiodeListe(nyListe);
    };

    const oppdaterVedtakslisteElement = (
        index: number,
        property: EPeriodeProperty,
        value: string | number | undefined
    ) => {
        const oppdatertListe = vedtaksperiodeListe.map((vedtaksperiode, i) => {
            if (i === index) {
                return { ...vedtaksperiode, [property]: value };
            }
            return vedtaksperiode;
        });

        settVedtaksperiodeListe(oppdatertListe);
    };

    const lagBlankett = () => {
        settLaster(true);
        axiosRequest<string, IVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandlingId}/lagre-vedtak`,
            data: {
                resultatType: vedtaksresultatType,
                periodeBegrunnelse,
                inntektBegrunnelse,
                perioder: vedtaksperiodeListe,
                periodeInntekt: inntektsperiodeListe,
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
                        // vedtaksperiodeData={vedtaksperiodeData}
                        // oppdaterVedtaksperiodeData={oppdaterVedtaksperiodeData}
                        vedtaksperiodeListe={vedtaksperiodeListe}
                        leggTilVedtaksperiode={leggTilVedtaksperiode}
                        fjernVedtaksperiode={fjernVedtaksperiode}
                        oppdaterVedtakslisteElement={oppdaterVedtakslisteElement}
                        periodeBegrunnelse={periodeBegrunnelse}
                        settPeriodeBegrunnelse={settPeriodeBegrunnelse}
                        valideringsfeil={valideringsfeil.vedtaksperioder}
                    />
                    <InntektsperiodeValg
                        // inntektsperiodeData={inntektsperiodeData}
                        // oppdaterInntektsperiodeData={oppdaterInntekstperiodeData}
                        inntektsperiodeListe={inntektsperiodeListe}
                        inntektBegrunnelse={inntektBegrunnelse}
                        settInntektBegrunnelse={settInntektBegrunnelse}
                        fjernInntektsperiode={fjernInntektsperiode}
                        leggTilInntektsperiode={leggTilInntektsperiode}
                        oppdaterInntektslisteElement={oppdaterInntektslisteElement}
                        settVisSamordning={settVisSamordning}
                        visSamordning={visSamordning}
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
