import React, { useCallback, useEffect, useState } from 'react';
import VedtaksperiodeValg, { tomVedtaksperiodeRad } from './VedtaksperiodeValg';
import InntektsperiodeValg, { tomInntektsperiodeRad } from './InntektsperiodeValg';
import { Hovedknapp as HovedknappNAV, Knapp } from 'nav-frontend-knapper';
import { Behandlingstype } from '../../../../App/typer/behandlingstype';
import {
    EBehandlingResultat,
    EPeriodetype,
    IBeløpsperiode,
    IBeregningsrequest,
    IInntektsperiode,
    IInnvilgeVedtak,
    IVedtak,
    IVedtaksperiode,
} from '../../../../App/typer/vedtak';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { useHistory } from 'react-router-dom';
import { useApp } from '../../../../App/context/AppContext';
import { Behandling } from '../../../../App/typer/fagsak';
import { v4 as uuidv4 } from 'uuid';
import hiddenIf from '../../../../Felles/HiddenIf/hiddenIf';
import { FieldState } from '../../../../App/hooks/felles/useFieldState';
import { ListState } from '../../../../App/hooks/felles/useListState';
import { Undertittel } from 'nav-frontend-typografi';
import { IngenBegrunnelseOppgitt } from './IngenBegrunnelseOppgitt';
import Utregningstabell from './Utregningstabell';
import useFormState, { FormState } from '../../../../App/hooks/felles/useFormState';
import { validerInnvilgetVedtakForm, validerVedtaksperioder } from '../vedtaksvalidering';
import AlertStripeFeilPreWrap from '../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { EnsligTextArea } from '../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../konstanter';
import styled from 'styled-components';

const Hovedknapp = hiddenIf(HovedknappNAV);

export type InnvilgeVedtakForm = Omit<IInnvilgeVedtak, 'resultatType'>;

const VedtaksperiodeWrapper = styled.section`
    padding-top: 1rem;
`;

const InntekWrapper = styled.section`
    padding-top: 2rem;
`;

const FormContentWrapper = styled.div`
    padding-top: 2rem;
`;

const EnsligTextAreaWrapper = styled.div`
    padding-bottom: 1rem;
`;

export const InnvilgeVedtak: React.FC<{
    behandling: Behandling;
    lagretVedtak?: IVedtak;
    vedtaksresultatType: EBehandlingResultat.INNVILGE | EBehandlingResultat.INNVILGE_MED_OPPHØR;
}> = ({ behandling, lagretVedtak, vedtaksresultatType }) => {
    const lagretInnvilgetVedtak =
        lagretVedtak?.resultatType === EBehandlingResultat.INNVILGE ||
        lagretVedtak?.resultatType === EBehandlingResultat.INNVILGE_MED_OPPHØR
            ? (lagretVedtak as IInnvilgeVedtak)
            : undefined;
    const { hentBehandling, behandlingErRedigerbar } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const history = useHistory();
    const [laster, settLaster] = useState<boolean>(false);
    const [beregnetStønad, settBeregnetStønad] = useState<Ressurs<IBeløpsperiode[]>>(
        byggTomRessurs()
    );

    const [feilmelding, settFeilmelding] = useState<string>();

    const formState = useFormState<InnvilgeVedtakForm>(
        {
            periodeBegrunnelse: lagretInnvilgetVedtak?.periodeBegrunnelse || '',
            inntektBegrunnelse: lagretInnvilgetVedtak?.inntektBegrunnelse || '',
            perioder: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.perioder
                : [tomVedtaksperiodeRad],
            inntekter: lagretInnvilgetVedtak?.inntekter
                ? lagretInnvilgetVedtak?.inntekter
                : [tomInntektsperiodeRad],
        },
        validerInnvilgetVedtakForm
    );
    const inntektsperiodeState = formState.getProps('inntekter') as ListState<IInntektsperiode>;
    const vedtaksperiodeState = formState.getProps('perioder') as ListState<IVedtaksperiode>;
    const periodeBegrunnelse = formState.getProps('periodeBegrunnelse') as FieldState;
    const inntektBegrunnelse = formState.getProps('inntektBegrunnelse') as FieldState;

    const inntektsperioder = inntektsperiodeState.value;
    const vedtaksperioder = vedtaksperiodeState.value;

    useEffect(() => {
        const førsteInnvilgedeVedtaksperiode =
            vedtaksperioder.find(
                (vedtaksperiode) => vedtaksperiode.periodeType !== EPeriodetype.MIDLERTIDIG_OPPHØR
            ) || vedtaksperioder[0];
        const førsteInntektsperiode = inntektsperioder.length > 0 && inntektsperioder[0];
        if (
            førsteInntektsperiode &&
            førsteInnvilgedeVedtaksperiode.årMånedFra !== førsteInntektsperiode.årMånedFra
        ) {
            inntektsperiodeState.update(
                {
                    ...inntektsperioder[0],
                    årMånedFra: førsteInnvilgedeVedtaksperiode.årMånedFra,
                    endretKey: uuidv4(),
                },
                0
            );
        }
    }, [vedtaksperioder, inntektsperiodeState, inntektsperioder]);

    const hentLagretBeløpForYtelse = useCallback(() => {
        axiosRequest<IBeløpsperiode[], void>({
            method: 'GET',
            url: `/familie-ef-sak/api/beregning/${behandling.id}`,
        }).then((res: Ressurs<IBeløpsperiode[]>) => settBeregnetStønad(res));
    }, [axiosRequest, behandling]);

    useEffect(() => {
        if (
            !behandlingErRedigerbar &&
            lagretInnvilgetVedtak &&
            behandling.type !== Behandlingstype.BLANKETT
        ) {
            hentLagretBeløpForYtelse();
        }
    }, [behandlingErRedigerbar, lagretInnvilgetVedtak, hentLagretBeløpForYtelse, behandling]);

    const beregnPerioder = () => {
        if (formState.customValidate(validerVedtaksperioder)) {
            axiosRequest<IBeløpsperiode[], IBeregningsrequest>({
                method: 'POST',
                url: `/familie-ef-sak/api/beregning/`,
                data: {
                    vedtaksperioder: vedtaksperioder,
                    inntekt: inntektsperioder.map((v) => ({
                        ...v,
                        forventetInntekt: v.forventetInntekt ?? 0,
                        samordningsfradrag: v.samordningsfradrag ?? 0,
                    })),
                },
            }).then((res: Ressurs<IBeløpsperiode[]>) => settBeregnetStønad(res));
        }
    };

    const håndterVedtaksresultat = (nesteUrl: string) => {
        return (res: Ressurs<string>) => {
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    history.push(nesteUrl);
                    hentBehandling.rerun();
                    nullstillIkkePersisterteKomponenter();
                    break;
                case RessursStatus.HENTER:
                case RessursStatus.IKKE_HENTET:
                    break;
                default:
                    settFeilmelding(res.frontendFeilmelding);
            }
        };
    };

    const lagBlankett = (vedtaksRequest: IInnvilgeVedtak) => {
        settLaster(true);
        axiosRequest<string, IInnvilgeVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandling.id}/lagre-blankettvedtak`,
            data: vedtaksRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/blankett`))
            .finally(() => {
                settLaster(false);
            });
    };

    const lagreVedtak = (vedtaksRequest: IInnvilgeVedtak) => {
        settLaster(true);
        axiosRequest<string, IInnvilgeVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandling.id}/fullfor`,
            data: vedtaksRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/simulering`))
            .finally(() => {
                settLaster(false);
            });
    };

    const handleSubmit = (form: FormState<InnvilgeVedtakForm>) => {
        const vedtaksRequest: IInnvilgeVedtak = {
            resultatType: vedtaksresultatType,
            periodeBegrunnelse: form.periodeBegrunnelse,
            inntektBegrunnelse: form.inntektBegrunnelse,
            perioder: form.perioder,
            inntekter: form.inntekter,
        };

        switch (behandling.type) {
            case Behandlingstype.BLANKETT:
                lagBlankett(vedtaksRequest);
                break;
            case Behandlingstype.FØRSTEGANGSBEHANDLING:
            case Behandlingstype.REVURDERING:
                lagreVedtak(vedtaksRequest);
                break;
        }
    };

    return (
        <form onSubmit={formState.onSubmit(handleSubmit)}>
            <FormContentWrapper>
                <VedtaksperiodeWrapper>
                    <Undertittel className={'blokk-s'}>Vedtaksperiode</Undertittel>
                    <VedtaksperiodeValg
                        vedtaksperiodeListe={vedtaksperiodeState}
                        valideringsfeil={formState.errors.perioder}
                        setValideringsFeil={formState.setErrors}
                        vedtaksresultatType={vedtaksresultatType}
                    />
                    {!behandlingErRedigerbar && periodeBegrunnelse.value === '' ? (
                        <IngenBegrunnelseOppgitt />
                    ) : (
                        <EnsligTextArea
                            value={periodeBegrunnelse.value}
                            onChange={(event) => {
                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                periodeBegrunnelse.onChange(event);
                            }}
                            label="Begrunnelse"
                            maxLength={0}
                            erLesevisning={!behandlingErRedigerbar}
                            feilmelding={formState.errors.periodeBegrunnelse}
                        />
                    )}
                </VedtaksperiodeWrapper>
                <InntekWrapper className={'blokk-m'}>
                    <Undertittel className={'blokk-s'}>Inntekt</Undertittel>
                    {!behandlingErRedigerbar && inntektBegrunnelse.value === '' ? (
                        <IngenBegrunnelseOppgitt />
                    ) : (
                        <EnsligTextAreaWrapper>
                            <EnsligTextArea
                                value={inntektBegrunnelse.value}
                                onChange={(event) => {
                                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                    inntektBegrunnelse.onChange(event);
                                }}
                                label="Begrunnelse for inntektsfastsettelse"
                                maxLength={0}
                                erLesevisning={!behandlingErRedigerbar}
                                feilmelding={formState.errors.inntektBegrunnelse}
                            />
                        </EnsligTextAreaWrapper>
                    )}
                    <InntektsperiodeValg
                        inntektsperiodeListe={inntektsperiodeState}
                        valideringsfeil={formState.errors.inntekter}
                        setValideringsFeil={formState.setErrors}
                    />
                    {behandlingErRedigerbar && (
                        <div className={'blokk-m'}>
                            <Knapp type={'standard'} onClick={beregnPerioder} htmlType="button">
                                Beregn
                            </Knapp>
                        </div>
                    )}
                    <Utregningstabell beregnetStønad={beregnetStønad} />
                </InntekWrapper>
                {feilmelding && (
                    <AlertStripeFeilPreWrap style={{ marginTop: '2rem' }}>
                        {feilmelding}
                    </AlertStripeFeilPreWrap>
                )}
                <Hovedknapp hidden={!behandlingErRedigerbar} htmlType="submit" disabled={laster}>
                    Lagre vedtak
                </Hovedknapp>
            </FormContentWrapper>
        </form>
    );
};
