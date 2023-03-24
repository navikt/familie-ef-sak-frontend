import React, { useCallback, useEffect, useState } from 'react';
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
    IVedtaksperiode,
    IVedtakType,
} from '../../../../../App/typer/vedtak';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../../App/typer/ressurs';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { useApp } from '../../../../../App/context/AppContext';
import { Behandling } from '../../../../../App/typer/fagsak';
import { v4 as uuidv4 } from 'uuid';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import Utregningstabell from './Utregningstabell';
import useFormState, { FormState } from '../../../../../App/hooks/felles/useFormState';
import { validerInnvilgetVedtakForm, validerVedtaksperioder } from '../vedtaksvalidering';
import AlertStripeFeilPreWrap from '../../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';
import { IVilkår } from '../../../Inngangsvilkår/vilkår';
import { utledYngsteBarnFødselsdato } from './fødselsdatoUtils';
import { useRedirectEtterLagring } from '../../../../../App/hooks/felles/useRedirectEtterLagring';
import HovedKnapp from '../../../../../Felles/Knapper/HovedKnapp';

export type InnvilgeVedtakForm = Omit<
    Omit<IInnvilgeVedtakForOvergangsstønad, 'resultatType'>,
    '_type'
> & { yngsteBarnFødselsdato?: string };

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Beregningstabell = styled(Utregningstabell)`
    margin-left: 1rem;
`;
export const InnvilgeVedtak: React.FC<{
    behandling: Behandling;
    lagretVedtak?: IInnvilgeVedtakForOvergangsstønad;
    revurderesFra?: string;
    vilkår: IVilkår;
}> = ({ behandling, lagretVedtak, revurderesFra, vilkår }) => {
    const { hentBehandling, behandlingErRedigerbar } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const { utførRedirect } = useRedirectEtterLagring(`/behandling/${behandling.id}/simulering`);
    const [laster, settLaster] = useState<boolean>(false);
    const [beregnetStønad, settBeregnetStønad] = useState<Ressurs<IBeløpsperiode[]>>(
        byggTomRessurs()
    );

    const [feilmelding, settFeilmelding] = useState<string>();

    const formState = useFormState<InnvilgeVedtakForm>(
        {
            periodeBegrunnelse: lagretVedtak?.periodeBegrunnelse || '',
            inntektBegrunnelse: lagretVedtak?.inntektBegrunnelse || '',
            perioder: lagretVedtak ? lagretVedtak.perioder : [tomVedtaksperiodeRad()],
            inntekter: lagretVedtak?.inntekter
                ? lagretVedtak?.inntekter
                : [tomInntektsperiodeRad()],
            samordningsfradragType: lagretVedtak?.samordningsfradragType || '',
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

    const hentLagretBeløpForYtelse = useCallback(() => {
        axiosRequest<IBeløpsperiode[], void>({
            method: 'GET',
            url: `/familie-ef-sak/api/beregning/${behandling.id}`,
        }).then((res: Ressurs<IBeløpsperiode[]>) => settBeregnetStønad(res));
    }, [axiosRequest, behandling]);

    useEffect(() => {
        if (!behandlingErRedigerbar && lagretVedtak) {
            hentLagretBeløpForYtelse();
        }
    }, [behandlingErRedigerbar, lagretVedtak, hentLagretBeløpForYtelse]);

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
        <Form onSubmit={formState.onSubmit(handleSubmit)}>
            <VedtaksperiodeValg
                errorState={formState.errors}
                periodeBegrunnelseState={periodeBegrunnelse}
                låsVedtaksperiodeRad={låsVedtaksperiodeRad}
                setValideringsFeil={formState.setErrors}
                vedtaksperiodeListe={vedtaksperiodeState}
            />
            <InntektsperiodeValg
                errorState={formState.errors}
                inntektBegrunnelseState={inntektBegrunnelse}
                inntektsperiodeListe={inntektsperiodeState}
                samordningsfradragstype={typeSamordningsfradag}
                setValideringsFeil={formState.setErrors}
                skalVelgeSamordningstype={skalVelgeSamordningstype}
            />
            {behandlingErRedigerbar && (
                <div>
                    <Button onClick={beregnPerioder} variant={'secondary'} type={'button'}>
                        Beregn
                    </Button>
                    {feilmelding && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
                </div>
            )}
            <Beregningstabell beregnetStønad={beregnetStønad} />
            {behandlingErRedigerbar && <HovedKnapp disabled={laster} knappetekst="Lagre vedtak" />}
        </Form>
    );
};
