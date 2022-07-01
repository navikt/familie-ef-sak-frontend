import React, { useCallback, useEffect, useState } from 'react';
import VedtaksperiodeValg, { tomVedtaksperiodeRad } from './VedtaksperiodeValg';
import InntektsperiodeValg, { tomInntektsperiodeRad } from './InntektsperiodeValg';
import { Hovedknapp as HovedknappNAV, Knapp } from 'nav-frontend-knapper';
import { Behandlingstype } from '../../../../../App/typer/behandlingstype';
import {
    EBehandlingResultat,
    EPeriodetype,
    IBeløpsperiode,
    IBeregningsrequest,
    IInntektsperiode,
    IInnvilgeVedtakForOvergangsstønad,
    IVedtakForOvergangsstønad,
    IVedtaksperiode,
    IVedtakType,
    IVedtakshistorikk,
} from '../../../../../App/typer/vedtak';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../../App/typer/ressurs';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../../../App/context/AppContext';
import { Behandling } from '../../../../../App/typer/fagsak';
import { v4 as uuidv4 } from 'uuid';
import hiddenIf from '../../../../../Felles/HiddenIf/hiddenIf';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { IngenBegrunnelseOppgitt } from './IngenBegrunnelseOppgitt';
import Utregningstabell from './Utregningstabell';
import useFormState, { FormState } from '../../../../../App/hooks/felles/useFormState';
import { validerInnvilgetVedtakForm, validerVedtaksperioder } from '../vedtaksvalidering';
import AlertStripeFeilPreWrap from '../../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import styled from 'styled-components';
import { Heading } from '@navikt/ds-react';
import { RevurderesFraOgMed } from './RevurderesFraOgMed';
import { useToggles } from '../../../../../App/context/TogglesContext';
import { ToggleName } from '../../../../../App/context/toggles';
import { useEffectNotInitialRender } from '../../../../../App/hooks/felles/useEffectNotInitialRender';

const Hovedknapp = hiddenIf(HovedknappNAV);

export type InnvilgeVedtakForm = Omit<
    Omit<IInnvilgeVedtakForOvergangsstønad, 'resultatType'>,
    '_type'
>;

const WrapperDobbelMarginTop = styled.div`
    margin-top: 2rem;
`;

const WrapperMarginTop = styled.div`
    margin-top: 1rem;
`;

export const InnvilgeVedtak: React.FC<{
    behandling: Behandling;
    lagretVedtak?: IVedtakForOvergangsstønad;
}> = ({ behandling, lagretVedtak }) => {
    const lagretInnvilgetVedtak =
        lagretVedtak?._type === IVedtakType.InnvilgelseOvergangsstønad
            ? (lagretVedtak as IInnvilgeVedtakForOvergangsstønad)
            : undefined;
    const { hentBehandling, behandlingErRedigerbar } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const navigate = useNavigate();
    const [laster, settLaster] = useState<boolean>(false);
    const [beregnetStønad, settBeregnetStønad] = useState<Ressurs<IBeløpsperiode[]>>(
        byggTomRessurs()
    );
    const [vedtakshistorikk, settVedtakshistorikk] = useState<IVedtakshistorikk>();
    const [revurderesFra, settRevurderesFra] = useState(
        lagretInnvilgetVedtak?.perioder.length
            ? lagretInnvilgetVedtak.perioder[0].årMånedFra
            : undefined
    );

    const { toggles } = useToggles();

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

    const låsVedtaksperiodeRad = revurderesFra && lagretInnvilgetVedtak?.perioder.length;

    useEffect(() => {
        if (!vedtakshistorikk?.perioder?.length || !toggles[ToggleName.skalPrefylleVedtaksperider])
            return;

        const perioderMedEndretKey = vedtakshistorikk.perioder.map((periode) => {
            return { ...periode, endretKey: uuidv4() };
        });

        vedtaksperiodeState.setValue(perioderMedEndretKey);

        // eslint-disable-next-line
    }, [vedtakshistorikk]);

    useEffect(() => {
        if (!vedtakshistorikk?.inntekter?.length || !toggles[ToggleName.skalPrefylleVedtaksperider])
            return;

        const inntekterMedEndretKey = vedtakshistorikk.inntekter.map((inntekt) => {
            return { ...inntekt, endretKey: uuidv4() };
        });

        inntektsperiodeState.setValue(inntekterMedEndretKey);

        // eslint-disable-next-line
    }, [vedtakshistorikk]);

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
        // eslint-disable-next-line
    }, [vedtaksperioder, inntektsperioder]);

    const skalVelgeSamordningstype = inntektsperiodeState.value.some(
        (rad) => rad.samordningsfradrag
    );

    const skalViseVedtaksperiodeOgInntekt =
        behandling.type !== Behandlingstype.REVURDERING || revurderesFra || !behandlingErRedigerbar;

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

    const hentVedtakshistorikk = useCallback(
        (revurderesFra: string) => {
            axiosRequest<IVedtakshistorikk, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/vedtak/fagsak/${behandling.fagsakId}/historikk/${revurderesFra}`,
            }).then((res: Ressurs<IVedtakshistorikk>) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settVedtakshistorikk(res.data);
                }
            });
        },
        [axiosRequest, behandling]
    );

    useEffectNotInitialRender(() => {
        if (!revurderesFra) return;

        hentVedtakshistorikk(revurderesFra);
    }, [revurderesFra, hentVedtakshistorikk]);

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

    const lagBlankett = (vedtaksRequest: IInnvilgeVedtakForOvergangsstønad) => {
        settLaster(true);
        axiosRequest<string, IInnvilgeVedtakForOvergangsstønad>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandling.id}/lagre-blankettvedtak`,
            data: vedtaksRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/blankett`))
            .finally(() => {
                settLaster(false);
            });
    };

    const lagreVedtak = (vedtaksRequest: IInnvilgeVedtakForOvergangsstønad) => {
        settLaster(true);
        axiosRequest<string, IInnvilgeVedtakForOvergangsstønad>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandling.id}/lagre-vedtak`,
            data: vedtaksRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/simulering`))
            .finally(() => {
                settLaster(false);
            });
    };

    const handleSubmit = (form: FormState<InnvilgeVedtakForm>) => {
        const vedtaksRequest: IInnvilgeVedtakForOvergangsstønad = {
            _type: IVedtakType.InnvilgelseOvergangsstønad,
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

    return (
        <form onSubmit={formState.onSubmit(handleSubmit)}>
            <WrapperDobbelMarginTop>
                {behandling.type === Behandlingstype.REVURDERING && behandlingErRedigerbar && (
                    <RevurderesFraOgMed
                        settRevurderesFra={settRevurderesFra}
                        revurderesFra={revurderesFra}
                    />
                )}
                {skalViseVedtaksperiodeOgInntekt && (
                    <>
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
                        <WrapperMarginTop>
                            <VedtaksperiodeValg
                                vedtaksperiodeListe={vedtaksperiodeState}
                                valideringsfeil={formState.errors.perioder}
                                setValideringsFeil={formState.setErrors}
                                låsVedtaksperiodeRad={låsVedtaksperiodeRad}
                            />
                        </WrapperMarginTop>
                    </>
                )}
            </WrapperDobbelMarginTop>
            {skalViseVedtaksperiodeOgInntekt && (
                <>
                    <WrapperMarginTop>
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
                        <WrapperMarginTop>
                            <InntektsperiodeValg
                                inntektsperiodeListe={inntektsperiodeState}
                                valideringsfeil={formState.errors.inntekter}
                                setValideringsFeil={formState.setErrors}
                                samordningsfradragstype={typeSamordningsfradag}
                                skalVelgeSamordningstype={skalVelgeSamordningstype}
                                samordningValideringsfeil={formState.errors.samordningsfradragType}
                            />
                        </WrapperMarginTop>
                        {behandlingErRedigerbar && (
                            <WrapperMarginTop>
                                <Knapp type={'standard'} onClick={beregnPerioder} htmlType="button">
                                    Beregn
                                </Knapp>
                            </WrapperMarginTop>
                        )}
                    </WrapperMarginTop>
                    <WrapperDobbelMarginTop>
                        <Utregningstabell beregnetStønad={beregnetStønad} />
                    </WrapperDobbelMarginTop>
                    {feilmelding && (
                        <AlertStripeFeilPreWrap style={{ marginTop: '2rem' }}>
                            {feilmelding}
                        </AlertStripeFeilPreWrap>
                    )}
                    <WrapperDobbelMarginTop>
                        <Hovedknapp
                            hidden={!behandlingErRedigerbar}
                            htmlType="submit"
                            disabled={laster}
                        >
                            Lagre vedtak
                        </Hovedknapp>
                    </WrapperDobbelMarginTop>
                </>
            )}
        </form>
    );
};
