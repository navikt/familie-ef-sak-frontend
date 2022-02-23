import React, { useCallback, useEffect, useState } from 'react';
import VedtaksperiodeValg, { tomVedtaksperiodeRad } from './VedtaksperiodeValg';
import InntektsperiodeValg, { tomInntektsperiodeRad } from './InntektsperiodeValg';
import { Hovedknapp as HovedknappNAV, Knapp } from 'nav-frontend-knapper';
import { Behandlingstype } from '../../../../App/typer/behandlingstype';
import {
    EBehandlingResultat,
    EPeriodetype,
    ESamordningsfradragtype,
    IBeløpsperiode,
    IBeregningsrequest,
    IInntektsperiode,
    IInnvilgeVedtak,
    IVedtak,
    IVedtaksperiode,
} from '../../../../App/typer/vedtak';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../../App/context/AppContext';
import { Behandling } from '../../../../App/typer/fagsak';
import { v4 as uuidv4 } from 'uuid';
import hiddenIf from '../../../../Felles/HiddenIf/hiddenIf';
import { FieldState } from '../../../../App/hooks/felles/useFieldState';
import { ListState } from '../../../../App/hooks/felles/useListState';
import { IngenBegrunnelseOppgitt } from './IngenBegrunnelseOppgitt';
import Utregningstabell from './Utregningstabell';
import useFormState, { FormState } from '../../../../App/hooks/felles/useFormState';
import { validerInnvilgetVedtakForm, validerVedtaksperioder } from '../vedtaksvalidering';
import AlertStripeFeilPreWrap from '../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { EnsligTextArea } from '../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../konstanter';
import styled from 'styled-components';
import { FamilieSelect } from '@navikt/familie-form-elements';
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema';
import { Heading } from '@navikt/ds-react';

const Hovedknapp = hiddenIf(HovedknappNAV);

export type InnvilgeVedtakForm = Omit<IInnvilgeVedtak, 'resultatType'>;

const WrapperPaddingTop = styled.div`
    padding-top: 1rem;
`;

const WrapperDobbelPaddingTop = styled.div`
    padding-top: 2rem;
`;

const WrapperDobbelMarginTop = styled.div`
    margin-top: 2rem;
`;

const StyledUtregningstabell = styled(Utregningstabell)`
    padding: 0rem;
    margin: 0rem;
    .tittel {
        padding-bottom: 0rem;
    }
    grid-gap: 0rem;
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
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const navigate = useNavigate();
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
            samordningsfradragType: lagretInnvilgetVedtak?.samordningsfradragType || '',
        },
        validerInnvilgetVedtakForm
    );
    const inntektsperiodeState = formState.getProps('inntekter') as ListState<IInntektsperiode>;
    const vedtaksperiodeState = formState.getProps('perioder') as ListState<IVedtaksperiode>;
    const periodeBegrunnelse = formState.getProps('periodeBegrunnelse') as FieldState;
    const inntektBegrunnelse = formState.getProps('inntektBegrunnelse') as FieldState;
    const typeSamordningsfradag = formState.getProps('samordningsfradragType') as FieldState;

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
                    navigate(nesteUrl);
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
            resultatType: EBehandlingResultat.INNVILGE,
            periodeBegrunnelse: form.periodeBegrunnelse,
            inntektBegrunnelse: form.inntektBegrunnelse,
            perioder: form.perioder,
            inntekter: form.inntekter,
            samordningsfradragType: skalVelgeSamordningstype ? form.samordningsfradragType : null,
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

    const skalVelgeSamordningstype = inntektsperiodeState.value.some(
        (rad) => rad.samordningsfradrag
    );

    return (
        <form onSubmit={formState.onSubmit(handleSubmit)}>
            <WrapperDobbelPaddingTop>
                <Heading spacing size="small" level="5">
                    Vedtaksperiode
                </Heading>
                {!behandlingErRedigerbar && periodeBegrunnelse.value === '' ? (
                    <IngenBegrunnelseOppgitt />
                ) : (
                    <EnsligTextArea
                        value={periodeBegrunnelse.value}
                        onChange={(event) => {
                            settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                            periodeBegrunnelse.onChange(event);
                        }}
                        label="Begrunnelse for vedtaksperiode"
                        maxLength={0}
                        erLesevisning={!behandlingErRedigerbar}
                        feilmelding={formState.errors.periodeBegrunnelse}
                    />
                )}
                <WrapperPaddingTop>
                    <VedtaksperiodeValg
                        vedtaksperiodeListe={vedtaksperiodeState}
                        valideringsfeil={formState.errors.perioder}
                        setValideringsFeil={formState.setErrors}
                    />
                </WrapperPaddingTop>
            </WrapperDobbelPaddingTop>
            <WrapperDobbelPaddingTop>
                <Heading spacing size="small" level="5">
                    Inntekt
                </Heading>
                {!behandlingErRedigerbar && inntektBegrunnelse.value === '' ? (
                    <IngenBegrunnelseOppgitt />
                ) : (
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
                )}
                <WrapperPaddingTop>
                    <InntektsperiodeValg
                        inntektsperiodeListe={inntektsperiodeState}
                        valideringsfeil={formState.errors.inntekter}
                        setValideringsFeil={formState.setErrors}
                        samordningsfradragstype={
                            typeSamordningsfradag.value as ESamordningsfradragtype
                        }
                    />
                </WrapperPaddingTop>
                {skalVelgeSamordningstype && behandlingErRedigerbar && (
                    <>
                        <FamilieSelect
                            bredde={'m'}
                            value={typeSamordningsfradag.value}
                            label={'Type samordningsfradag'}
                            onChange={(event) => {
                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                typeSamordningsfradag.onChange(event);
                            }}
                            erLesevisning={!behandlingErRedigerbar}
                        >
                            <option value="">Velg</option>
                            <option value={ESamordningsfradragtype.GJENLEVENDEPENSJON}>
                                Gjenlevendepensjon
                            </option>
                            <option value={ESamordningsfradragtype.UFØRETRYGD}>Uføretrygd</option>
                        </FamilieSelect>
                        <SkjemaelementFeilmelding>
                            {formState.errors.samordningsfradragType}
                        </SkjemaelementFeilmelding>
                    </>
                )}
                {behandlingErRedigerbar && (
                    <WrapperDobbelMarginTop>
                        <div className={'blokk-m'}>
                            <Knapp type={'standard'} onClick={beregnPerioder} htmlType="button">
                                Beregn
                            </Knapp>
                        </div>
                    </WrapperDobbelMarginTop>
                )}
            </WrapperDobbelPaddingTop>
            <WrapperDobbelPaddingTop>
                <StyledUtregningstabell beregnetStønad={beregnetStønad} />
            </WrapperDobbelPaddingTop>
            {feilmelding && (
                <AlertStripeFeilPreWrap style={{ marginTop: '2rem' }}>
                    {feilmelding}
                </AlertStripeFeilPreWrap>
            )}
            <Hovedknapp hidden={!behandlingErRedigerbar} htmlType="submit" disabled={laster}>
                Lagre vedtak
            </Hovedknapp>
        </form>
    );
};
