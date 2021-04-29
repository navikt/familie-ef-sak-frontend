import React, { useState } from 'react';
import VedtaksperiodeValg, {
    IVedtaksperiodeData,
    tomVedtaksperiodeRad,
} from './VedtaksperiodeValg';
import InntektsperiodeValg, {
    IInntektsperiodeData,
    tomInntektsperiodeRad,
} from './InntektsperiodeValg';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Behandlingstype } from '../../../../typer/behandlingstype';
import {
    EBehandlingResultat,
    IBeløpsperiode,
    IBeregningsrequest,
    IInnvilgeVedtak,
    IValideringsfeil,
    IVedtak,
} from '../../../../typer/vedtak';
import { validerVedtaksperioder } from '../vedtaksvalidering';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../typer/ressurs';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useHistory } from 'react-router-dom';
import { useApp } from '../../../../context/AppContext';
import { Behandling } from '../../../../typer/fagsak';
import { Calculator } from '@navikt/ds-icons';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

const KnappMedMargin = styled(Knapp)`
    margin-bottom: 1rem;
    margin-top: 1rem;
`;

export const InnvilgeVedtak: React.FC<{
    behandling: Behandling;
    lagretVedtak?: IVedtak;
}> = ({ behandling, lagretVedtak }) => {
    const lagretInnvilgetVedtak =
        lagretVedtak?.resultatType === EBehandlingResultat.INNVILGE
            ? (lagretVedtak as IInnvilgeVedtak)
            : undefined;
    const { hentBehandling } = useBehandling();
    const { axiosRequest } = useApp();
    const history = useHistory();
    const [laster, settLaster] = useState<boolean>(false);
    const [beregnetStønad, settBeregnetStønad] = useState<Ressurs<IBeløpsperiode[]>>(
        byggTomRessurs()
    );

    const [feilmelding, settFeilmelding] = useState<string>();
    const [valideringsfeil, settValideringsfeil] = useState<IValideringsfeil>({
        vedtaksperioder: [],
        inntektsperioder: [],
    });

    const [vedtaksperiodeData, settVedtaksperiodeData] = useState<IVedtaksperiodeData>({
        periodeBegrunnelse: lagretInnvilgetVedtak?.periodeBegrunnelse || '',
        vedtaksperiodeListe: lagretInnvilgetVedtak
            ? lagretInnvilgetVedtak.perioder
            : [tomVedtaksperiodeRad],
    });

    const [inntektsperiodeData, settInntektsperiodeData] = useState<IInntektsperiodeData>({
        inntektBegrunnelse: lagretInnvilgetVedtak?.inntektBegrunnelse || '',
        inntektsperiodeListe: lagretInnvilgetVedtak?.inntekter
            ? lagretInnvilgetVedtak?.inntekter
            : [tomInntektsperiodeRad],
    });

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

    const vedtaksRequest: IInnvilgeVedtak = {
        resultatType: EBehandlingResultat.INNVILGE,
        periodeBegrunnelse: vedtaksperiodeData.periodeBegrunnelse,
        inntektBegrunnelse: inntektsperiodeData.inntektBegrunnelse,
        perioder: vedtaksperiodeData.vedtaksperiodeListe,
        inntekter: inntektsperiodeData.inntektsperiodeListe,
    };

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
        axiosRequest<string, IInnvilgeVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandling.id}/lagre-vedtak`,
            data: vedtaksRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/blankett`))
            .finally(() => {
                settLaster(false);
            });
    };

    const lagreVedtak = () => {
        settLaster(true);
        axiosRequest<string, IInnvilgeVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandling.id}/fullfor`,
            data: vedtaksRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/brev`))
            .finally(() => {
                settLaster(false);
            });
    };

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
                                throw Error('Støtter ikke behandlingstype revurdering ennå...');
                        }
                    }
                }}
                disabled={laster}
            >
                Lagre vedtak
            </Hovedknapp>
            {feilmelding && (
                <AlertStripeFeil style={{ marginTop: '2rem' }}>{feilmelding}</AlertStripeFeil>
            )}
        </>
    );
};
