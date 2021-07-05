import React, { useCallback, useEffect, useState } from 'react';
import VedtaksperiodeValg, { tomVedtaksperiodeRad } from './VedtaksperiodeValg';
import InntektsperiodeValg, { tomInntektsperiodeRad } from './InntektsperiodeValg';
import { Hovedknapp as HovedknappNAV, Knapp } from 'nav-frontend-knapper';
import { Behandlingstype } from '../../../typer/behandlingstype';
import {
    EBehandlingResultat,
    IBeløpsperiode,
    IBeregningsrequest,
    IInntektsperiode,
    IInnvilgeVedtak,
    IVedtak,
    IVedtaksperiode,
} from '../../../typer/vedtak';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import { useBehandling } from '../../../context/BehandlingContext';
import { useHistory } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { Behandling } from '../../../typer/fagsak';
import { v4 as uuidv4 } from 'uuid';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import hiddenIf from '../../../Felleskomponenter/HiddenIf/hiddenIf';
import { FieldState } from '../../../hooks/felles/useFieldState';
import { ListState } from '../../../hooks/felles/useListState';
import { Undertittel } from 'nav-frontend-typografi';
import { IngenBegrunnelseOppgitt } from './IngenBegrunnelseOppgitt';
import styled from 'styled-components';
import { FamilieTextarea } from '@navikt/familie-form-elements';
import Utregningstabell from './Utregningstabell';
import useFormState, { FormState } from '../../../hooks/felles/useFormState';
import { validerVedtaksperioder } from '../vedtaksvalidering';

const StyledFamilieTextarea = styled(FamilieTextarea)`
    white-space: pre-wrap;
    word-wrap: break-word;
    max-width: 60rem;
    margin-bottom: 2rem;
    .typo-element {
        padding-bottom: 0.5rem;
    }
`;
const Hovedknapp = hiddenIf(HovedknappNAV);

export type InnvilgeVedtakForm = Omit<IInnvilgeVedtak, 'resultatType'>;

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
        validerVedtaksperioder
    );
    const inntektsperiodState = formState.getProps('inntekter') as ListState<IInntektsperiode>;
    const vedtaksperiodeState = formState.getProps('perioder') as ListState<IVedtaksperiode>;
    const periodeBegrunnelse = formState.getProps('periodeBegrunnelse') as FieldState;
    const inntektBegrunnelse = formState.getProps('inntektBegrunnelse') as FieldState;

    const inntektsperioder = inntektsperiodState.value;
    const vedtaksperioder = vedtaksperiodeState.value;

    useEffect(() => {
        const førsteVedtaksperiode = vedtaksperioder[0];
        const førsteInntektsperiode = inntektsperioder.length > 0 && inntektsperioder[0];
        if (
            førsteInntektsperiode &&
            førsteVedtaksperiode.årMånedFra !== førsteInntektsperiode.årMånedFra
        ) {
            inntektsperiodState.update(
                {
                    ...inntektsperioder[0],
                    årMånedFra: førsteVedtaksperiode.årMånedFra,
                    endretKey: uuidv4(),
                },
                0
            );
        }
    }, [vedtaksperioder, inntektsperiodState, inntektsperioder]);

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
    }, [behandlingErRedigerbar, lagretInnvilgetVedtak, hentLagretBeløpForYtelse]);

    const beregnPerioder = () => {
        if (formState.validateForm()) {
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
            url: `/familie-ef-sak/api/beregning/${behandling.id}/lagre-vedtak`,
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
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/brev`))
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
        };

        switch (behandling.type) {
            case Behandlingstype.BLANKETT:
                lagBlankett(vedtaksRequest);
                break;
            case Behandlingstype.FØRSTEGANGSBEHANDLING:
                lagreVedtak(vedtaksRequest);
                break;
            case Behandlingstype.REVURDERING:
                throw Error('Støtter ikke behandlingstype revurdering ennå...');
        }
    };

    return (
        <form onSubmit={formState.onSubmit(handleSubmit)}>
            <section className={'blokk-xl'}>
                <Undertittel className={'blokk-s'}>Vedtaksperiode</Undertittel>
                <VedtaksperiodeValg
                    vedtaksperiodeListe={vedtaksperiodeState}
                    valideringsfeil={formState.errors.perioder}
                    setValideringsFeil={formState.setErrors}
                />
                {!behandlingErRedigerbar && periodeBegrunnelse.value === '' ? (
                    <IngenBegrunnelseOppgitt />
                ) : (
                    <StyledFamilieTextarea
                        value={periodeBegrunnelse.value}
                        onChange={periodeBegrunnelse.onChange}
                        label="Begrunnelse"
                        maxLength={0}
                        erLesevisning={!behandlingErRedigerbar}
                    />
                )}
            </section>
            <section>
                <Undertittel className={'blokk-s'}>Inntekt</Undertittel>
                <InntektsperiodeValg
                    inntektsperiodeListe={inntektsperiodState}
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
                {!behandlingErRedigerbar && inntektBegrunnelse.value === '' ? (
                    <IngenBegrunnelseOppgitt />
                ) : (
                    <StyledFamilieTextarea
                        value={inntektBegrunnelse.value}
                        onChange={inntektBegrunnelse.onChange}
                        label="Begrunnelse"
                        maxLength={0}
                        erLesevisning={!behandlingErRedigerbar}
                    />
                )}
            </section>
            <Hovedknapp hidden={!behandlingErRedigerbar} htmlType="submit" disabled={laster}>
                Lagre vedtak
            </Hovedknapp>
            {feilmelding && (
                <AlertStripeFeil style={{ marginTop: '2rem' }}>{feilmelding}</AlertStripeFeil>
            )}
        </form>
    );
};
