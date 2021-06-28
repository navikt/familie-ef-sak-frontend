import React, { FormEvent, useEffect, useState } from 'react';
import VedtaksperiodeValg, { tomVedtaksperiodeRad } from './VedtaksperiodeValg';
import InntektsperiodeValg, { tomInntektsperiodeRad } from './InntektsperiodeValg';
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
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import hiddenIf from '../../../Felleskomponenter/HiddenIf/hiddenIf';
import useFieldState from '../../../../hooks/felles/useFieldState';
import useListState from '../../../../hooks/felles/useListState';
import { Undertittel } from 'nav-frontend-typografi';
import { IngenBegrunnelseOppgitt } from './IngenBegrunnelseOppgitt';
import styled from 'styled-components';
import { FamilieTextarea } from '@navikt/familie-form-elements';
import Utregningstabell from './Utregningstabell';

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
    const periodeBegrunnelse = useFieldState(lagretInnvilgetVedtak?.periodeBegrunnelse || '');
    const inntektBegrunnelse = useFieldState(lagretInnvilgetVedtak?.inntektBegrunnelse || '');
    const vedtaksperiodeListe = useListState(
        lagretInnvilgetVedtak ? lagretInnvilgetVedtak.perioder : [tomVedtaksperiodeRad]
    );
    const inntektsperiodeListe = useListState(
        lagretInnvilgetVedtak?.inntekter
            ? lagretInnvilgetVedtak?.inntekter
            : [tomInntektsperiodeRad]
    );

    const validerVedtak = (): boolean => {
        const harRiktigePerioder = validerPerioder();

        const aktivitetsfeil = validerAktivitetsType(vedtaksperiodeListe.value);
        const periodetypeFeil = validerPeriodetype(vedtaksperiodeListe.value);
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
        const vedtaksperioder = validerVedtaksPerioder(vedtaksperiodeListe.value);
        const inntektsperioder = validerInntektsperioder(
            inntektsperiodeListe.value,
            vedtaksperiodeListe.value
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

    useEffect(() => {
        const førsteVedtaksperiode = vedtaksperiodeListe.value[0];
        const førsteInntektsperiode =
            inntektsperiodeListe.value.length > 0 && inntektsperiodeListe.value[0];
        if (
            førsteInntektsperiode &&
            førsteVedtaksperiode.årMånedFra !== førsteInntektsperiode.årMånedFra
        ) {
            inntektsperiodeListe.update(
                {
                    ...inntektsperiodeListe.value[0],
                    årMånedFra: førsteVedtaksperiode.årMånedFra,
                    endretKey: uuidv4(),
                },
                0
            );
        }
    }, [vedtaksperiodeListe, inntektsperiodeListe]);

    const beregnPerioder = () => {
        if (validerPerioder()) {
            axiosRequest<IBeløpsperiode[], IBeregningsrequest>({
                method: 'POST',
                url: `/familie-ef-sak/api/beregning/`,
                data: {
                    vedtaksperioder: vedtaksperiodeListe.value,
                    inntekt: inntektsperiodeListe.value.map((v) => ({
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

    console.log('valideringsfeil', valideringsfeil);

    const v = (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (validerVedtak()) {
            const vedtaksRequest: IInnvilgeVedtak = {
                resultatType: EBehandlingResultat.INNVILGE,
                periodeBegrunnelse: periodeBegrunnelse.value,
                inntektBegrunnelse: inntektBegrunnelse.value,
                perioder: vedtaksperiodeListe.value,
                inntekter: inntektsperiodeListe.value,
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
        }
    };

    return (
        <form onSubmit={v}>
            <section className={'blokk-xl'}>
                <Undertittel className={'blokk-s'}>Vedtaksperiode</Undertittel>
                <VedtaksperiodeValg
                    vedtaksperiodeListe={vedtaksperiodeListe}
                    valideringsfeil={valideringsfeil?.vedtak}
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
                    inntektsperiodeListe={inntektsperiodeListe}
                    inntektBegrunnelse={inntektBegrunnelse}
                    beregnPerioder={beregnPerioder}
                    beregnetStønad={beregnetStønad}
                    valideringsfeil={valideringsfeil?.inntekt}
                />
                <div className={'blokk-m'}>
                    <Knapp type={'standard'} onClick={beregnPerioder} htmlType="button">
                        Beregn
                    </Knapp>
                </div>
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
