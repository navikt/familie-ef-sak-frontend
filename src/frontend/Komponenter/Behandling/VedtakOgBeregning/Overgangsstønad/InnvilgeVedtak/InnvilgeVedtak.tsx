import React, { useCallback, useEffect, useMemo, useState } from 'react';
import VedtaksperiodeValg, { tomVedtaksperiodeRad } from './VedtaksperiodeValg';
import InntektsperiodeValg, { tomInntektsperiodeRad } from './InntektsperiodeValg';
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
} from '../../../../../App/typer/vedtak';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../../../App/typer/ressurs';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { useApp } from '../../../../../App/context/AppContext';
import { Behandling } from '../../../../../App/typer/fagsak';
import { v4 as uuidv4 } from 'uuid';
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
import { Button, Heading } from '@navikt/ds-react';
import { useEffectNotInitialRender } from '../../../../../App/hooks/felles/useEffectNotInitialRender';
import {
    fyllHullMedOpphør,
    revurdererFraPeriodeUtenStønad,
    revurderFraInitPeriode,
} from './revurderFraUtils';
import { RevurderesFraOgMed } from '../../Felles/RevurderesFraOgMed';
import { IVilkår } from '../../../Inngangsvilkår/vilkår';
import { utledYngsteBarnFødselsdato } from './fødselsdatoUtils';
import { oppdaterVedtakMedEndretKey } from './utils';
import { useRedirectEtterLagring } from '../../../../../App/hooks/felles/useRedirectEtterLagring';

export type InnvilgeVedtakForm = Omit<
    Omit<IInnvilgeVedtakForOvergangsstønad, 'resultatType'>,
    '_type'
> & { yngsteBarnFødselsdato?: string };

const WrapperDobbelMarginTop = styled.div`
    margin-top: 2rem;
`;

const WrapperMarginTop = styled.div`
    margin-top: 1rem;
`;

export const InnvilgeVedtak: React.FC<{
    behandling: Behandling;
    lagretVedtak?: IVedtakForOvergangsstønad;
    vilkår: IVilkår;
}> = ({ behandling, lagretVedtak, vilkår }) => {
    const lagretInnvilgetVedtak = useMemo(
        () =>
            lagretVedtak?._type === IVedtakType.InnvilgelseOvergangsstønad
                ? oppdaterVedtakMedEndretKey(lagretVedtak as IInnvilgeVedtakForOvergangsstønad)
                : undefined,
        [lagretVedtak]
    );

    const { hentBehandling, behandlingErRedigerbar } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const { utførRedirect } = useRedirectEtterLagring(`/behandling/${behandling.id}/simulering`);
    const [laster, settLaster] = useState<boolean>(false);
    const [beregnetStønad, settBeregnetStønad] = useState<Ressurs<IBeløpsperiode[]>>(
        byggTomRessurs()
    );
    const [vedtakshistorikk, settVedtakshistorikk] = useState<IInnvilgeVedtakForOvergangsstønad>();
    const [revurderesFra, settRevurderesFra] = useState(
        behandling.forrigeBehandlingId && lagretInnvilgetVedtak?.perioder.length
            ? lagretInnvilgetVedtak.perioder[0].årMånedFra
            : undefined
    );
    const [revurderesFraOgMedFeilmelding, settRevurderesFraOgMedFeilmelding] = useState<
        string | null
    >(null);

    const [feilmelding, settFeilmelding] = useState<string>();

    const formState = useFormState<InnvilgeVedtakForm>(
        {
            periodeBegrunnelse: lagretInnvilgetVedtak?.periodeBegrunnelse || '',
            inntektBegrunnelse: lagretInnvilgetVedtak?.inntektBegrunnelse || '',
            perioder: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.perioder
                : [tomVedtaksperiodeRad()],
            inntekter: lagretInnvilgetVedtak?.inntekter
                ? lagretInnvilgetVedtak?.inntekter
                : [tomInntektsperiodeRad()],
            samordningsfradragType: lagretInnvilgetVedtak?.samordningsfradragType || '',
            yngsteBarnFødselsdato: utledYngsteBarnFødselsdato(vilkår) || '',
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

    const låsVedtaksperiodeRad = !!revurderesFra;

    useEffect(() => {
        if (!revurderesFra || !vedtakshistorikk) {
            return;
        }

        vedtaksperiodeState.setValue([
            ...revurderFraInitPeriode(vedtakshistorikk, revurderesFra, tomVedtaksperiodeRad),
            ...vedtakshistorikk.perioder.reduce(fyllHullMedOpphør, [] as IVedtaksperiode[]),
        ]);

        inntektsperiodeState.setValue([
            ...revurderFraInitPeriode(vedtakshistorikk, revurderesFra, tomInntektsperiodeRad),
            ...vedtakshistorikk.inntekter,
        ]);

        formState.setErrors((prevState) => ({ ...prevState, perioder: [], inntekter: [] }));

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
            førsteInnvilgedeVedtaksperiode &&
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
        !behandling.forrigeBehandlingId || revurderesFra || !behandlingErRedigerbar;

    const hentLagretBeløpForYtelse = useCallback(() => {
        axiosRequest<IBeløpsperiode[], void>({
            method: 'GET',
            url: `/familie-ef-sak/api/beregning/${behandling.id}`,
        }).then((res: Ressurs<IBeløpsperiode[]>) => settBeregnetStønad(res));
    }, [axiosRequest, behandling]);

    useEffect(() => {
        if (!behandlingErRedigerbar && lagretInnvilgetVedtak) {
            hentLagretBeløpForYtelse();
        }
    }, [behandlingErRedigerbar, lagretInnvilgetVedtak, hentLagretBeløpForYtelse, behandling]);

    const beregnPerioder = () => {
        if (formState.customValidate(validerVedtaksperioder)) {
            axiosRequest<IBeløpsperiode[], IBeregningsrequest>({
                method: 'POST',
                url: `/familie-ef-sak/api/beregning`,
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
            axiosRequest<IInnvilgeVedtakForOvergangsstønad, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/vedtak/fagsak/${behandling.fagsakId}/historikk/${revurderesFra}`,
            }).then((res: RessursSuksess<IInnvilgeVedtakForOvergangsstønad> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                    settVedtakshistorikk(oppdaterVedtakMedEndretKey(res.data));
                } else {
                    settRevurderesFraOgMedFeilmelding(res.frontendFeilmelding);
                }
            });
        },
        // eslint-disable-next-line
        [axiosRequest, behandling]
    );

    useEffectNotInitialRender(() => {
        if (!revurderesFra) return;

        hentVedtakshistorikk(revurderesFra);
    }, [revurderesFra, hentVedtakshistorikk]);

    const håndterVedtaksresultat = () => {
        return (res: Ressurs<string>) => {
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    hentBehandling.rerun();
                    utførRedirect();
                    break;
                case RessursStatus.HENTER:
                case RessursStatus.IKKE_HENTET:
                    break;
                default:
                    settFeilmelding(res.frontendFeilmelding);
                    settIkkePersistertKomponent(uuidv4());
            }
        };
    };

    const lagreVedtak = (vedtaksRequest: IInnvilgeVedtakForOvergangsstønad) => {
        settLaster(true);
        nullstillIkkePersisterteKomponenter();
        axiosRequest<string, IInnvilgeVedtakForOvergangsstønad>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandling.id}/lagre-vedtak`,
            data: vedtaksRequest,
        })
            .then(håndterVedtaksresultat())
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
            case Behandlingstype.FØRSTEGANGSBEHANDLING:
            case Behandlingstype.REVURDERING:
                lagreVedtak(vedtaksRequest);
                break;
        }
    };

    return (
        <form onSubmit={formState.onSubmit(handleSubmit)}>
            <WrapperDobbelMarginTop>
                {behandling.forrigeBehandlingId && behandlingErRedigerbar ? (
                    <RevurderesFraOgMed
                        settRevurderesFra={settRevurderesFra}
                        revurderesFra={revurderesFra}
                        feilmelding={revurderesFraOgMedFeilmelding}
                        revurdererFraPeriodeUtenStønad={revurdererFraPeriodeUtenStønad(
                            vedtakshistorikk,
                            revurderesFra
                        )}
                        type={'OVERGANGSSTØNAD'}
                    />
                ) : null}
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
                                <Button
                                    onClick={beregnPerioder}
                                    variant={'secondary'}
                                    type={'button'}
                                >
                                    Beregn
                                </Button>
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
                    {behandlingErRedigerbar && (
                        <WrapperDobbelMarginTop>
                            <Button
                                variant={'primary'}
                                disabled={laster || !!revurderesFraOgMedFeilmelding}
                                type={'submit'}
                            >
                                Lagre vedtak
                            </Button>
                        </WrapperDobbelMarginTop>
                    )}
                </>
            )}
        </form>
    );
};
