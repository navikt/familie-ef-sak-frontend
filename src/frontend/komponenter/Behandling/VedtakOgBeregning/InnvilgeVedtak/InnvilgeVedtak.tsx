import React, { FormEvent, useState } from 'react';
import VedtaksperiodeValg, {
    IVedtaksperiodeData,
    tomVedtaksperiodeRad,
} from './VedtaksperiodeValg';
import InntektsperiodeValg, {
    IInntektsperiodeData,
    tomInntektsperiodeRad,
} from './InntektsperiodeValg';
import { Hovedknapp as HovedknappNAV, Knapp } from 'nav-frontend-knapper';
import { Behandlingstype } from '../../../../typer/behandlingstype';
import {
    EBehandlingResultat,
    IBeløpsperiode,
    IBeregningsrequest,
    IInnvilgeVedtak,
    IValideringsfeil,
    IVedtak,
} from '../../../../typer/vedtak';
import {
    validerAktivitetsType,
    validerInntektsperioder,
    validerPeriodetype,
    validerVedtaksPerioder,
} from '../vedtaksvalidering';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../typer/ressurs';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useHistory } from 'react-router-dom';
import { useApp } from '../../../../context/AppContext';
import { Behandling } from '../../../../typer/fagsak';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import hiddenIf from '../../../Felleskomponenter/HiddenIf/hiddenIf';
import Utregningstabell from './Utregningstabell';
import { FamilieTextarea } from '@navikt/familie-form-elements';
import { IngenBegrunnelseOppgitt } from './IngenBegrunnelseOppgitt';

const Hovedknapp = hiddenIf(HovedknappNAV);

const StyledFamilieTextarea = styled(FamilieTextarea)`
    white-space: pre-wrap;
    word-wrap: break-word;
    max-width: 60rem;
    margin-bottom: 2rem;
    .typo-element {
        padding-bottom: 0.5rem;
    }
`;

export const InnvilgeVedtak: React.FC<{
    behandling: Behandling;
    lagretVedtak?: IVedtak;
}> = ({ behandling, lagretVedtak }) => {
    const lagretInnvilgetVedtak =
        lagretVedtak?.resultatType === EBehandlingResultat.INNVILGE
            ? (lagretVedtak as IInnvilgeVedtak)
            : undefined;
    const { hentBehandling, behandlingErRedigerbar } = useBehandling();
    const { axiosRequest } = useApp();
    const history = useHistory();
    const [laster, settLaster] = useState<boolean>(false);
    const [beregnetStønad, settBeregnetStønad] = useState<Ressurs<IBeløpsperiode[]>>(
        byggTomRessurs()
    );

    const [feilmelding, settFeilmelding] = useState<string>();
    const [valideringsfeil, settValideringsfeil] = useState<IValideringsfeil>();

    const [vedtaksperiodeData, settVedtaksperiodeData] = useState<IVedtaksperiodeData>({
        periodeBegrunnelse: lagretInnvilgetVedtak?.periodeBegrunnelse || '',
        vedtaksperiodeListe: lagretInnvilgetVedtak
            ? lagretInnvilgetVedtak.perioder
            : [tomVedtaksperiodeRad],
    });

    //TODO SPLIT UPP I begrunnelse och periode
    const [inntektsperiodeData, settInntektsperiodeData] = useState<IInntektsperiodeData>({
        inntektBegrunnelse: lagretInnvilgetVedtak?.inntektBegrunnelse || '',
        inntektsperiodeListe: lagretInnvilgetVedtak?.inntekter
            ? lagretInnvilgetVedtak?.inntekter
            : [tomInntektsperiodeRad],
    });

    const validerVedtak = (): boolean => {
        const harRiktigePerioder = validerPerioder();

        const aktivitetsfeil = validerAktivitetsType(vedtaksperiodeData.vedtaksperiodeListe);
        const periodetypeFeil = validerPeriodetype(vedtaksperiodeData.vedtaksperiodeListe);
        settValideringsfeil((prevState) => {
            if (!prevState) {
                return {
                    vedtak: aktivitetsfeil.map((v, index) => ({
                        aktivitetstype: v,
                        type: periodetypeFeil[index],
                    })),
                    inntekt: [],
                };
            }
            const vedtak = prevState.vedtak.map((v, index) => {
                return {
                    ...v,
                    aktivitetstype: aktivitetsfeil[index],
                    type: periodetypeFeil[index],
                };
            });
            return { ...prevState, vedtak };
        });
        return (
            harRiktigePerioder &&
            aktivitetsfeil.concat(periodetypeFeil).every((v) => v === undefined)
        );
    };

    const validerPerioder = (): boolean => {
        const vedtaksperioder = validerVedtaksPerioder(vedtaksperiodeData.vedtaksperiodeListe);
        const inntektsperioder = validerInntektsperioder(
            inntektsperiodeData.inntektsperiodeListe,
            vedtaksperiodeData.vedtaksperiodeListe
        );

        settValideringsfeil((prevState) => {
            if (!prevState) {
                return {
                    vedtak: vedtaksperioder.map((v) => ({ periode: v })),
                    inntekt: inntektsperioder.map((v) => ({ periode: v })),
                };
            }
            const vedtak = prevState.vedtak.map((v, index) => {
                return { ...v, periode: vedtaksperioder[index] };
            });
            const inntekt = prevState.inntekt.map((i, index) => {
                return { ...i, periode: inntektsperioder[index] };
            });
            return { vedtak, inntekt };
        });

        return vedtaksperioder.concat(inntektsperioder).every((v) => v === undefined);
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
        if (validerPerioder()) {
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

    console.log('valideringsfeil', valideringsfeil);

    const v = (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
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
    };

    return (
        <form onSubmit={v}>
            <VedtaksperiodeValg
                vedtaksperiodeData={vedtaksperiodeData}
                settVedtaksperiodeData={oppdaterVedtaksperiodeData}
                valideringsfeil={valideringsfeil?.vedtak}
            />
            {!behandlingErRedigerbar && vedtaksperiodeData.periodeBegrunnelse === '' ? (
                <IngenBegrunnelseOppgitt />
            ) : (
                <StyledFamilieTextarea
                    value={vedtaksperiodeData.periodeBegrunnelse}
                    onChange={(e) => {
                        settVedtaksperiodeData({
                            ...vedtaksperiodeData,
                            periodeBegrunnelse: e.target.value,
                        });
                    }}
                    label="Begrunnelse"
                    maxLength={0}
                    erLesevisning={!behandlingErRedigerbar}
                />
            )}
            <InntektsperiodeValg
                inntektsperiodeData={inntektsperiodeData}
                settInntektsperiodeData={settInntektsperiodeData}
                beregnetStønad={beregnetStønad}
                beregnPerioder={beregnPerioder}
            />
            <div className={'blokk-m'}>
                <Knapp type={'standard'} onClick={beregnPerioder}>
                    Beregn
                </Knapp>
            </div>
            <Utregningstabell beregnetStønad={beregnetStønad} />

            {!behandlingErRedigerbar && inntektsperiodeData.inntektBegrunnelse === '' ? (
                <IngenBegrunnelseOppgitt />
            ) : (
                <StyledFamilieTextarea
                    value={inntektsperiodeData.inntektBegrunnelse}
                    onChange={(e) => {
                        settInntektsperiodeData({
                            ...inntektsperiodeData,
                            inntektBegrunnelse: e.target.value,
                        });
                    }}
                    label="Begrunnelse"
                    maxLength={0}
                    erLesevisning={!behandlingErRedigerbar}
                />
            )}
            <Hovedknapp hidden={!behandlingErRedigerbar} htmlType="submit" disabled={laster}>
                Lagre vedtak
            </Hovedknapp>
            {feilmelding && (
                <AlertStripeFeil style={{ marginTop: '2rem' }}>{feilmelding}</AlertStripeFeil>
            )}
        </form>
    );
};
