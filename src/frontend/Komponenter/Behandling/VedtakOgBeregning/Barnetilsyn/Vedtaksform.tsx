import {
    EBehandlingResultat,
    ERadioValg,
    IBeregeningsresultatBarnetilsyn,
    IBeregningsrequestBarnetilsyn,
    IInnvilgeVedtakForBarnetilsyn,
    IKontantstøttePeriode,
    ITilleggsstønadPeriode,
    IUtgiftsperiode,
    IvedtakForBarnetilsyn,
} from '../../../../App/typer/vedtak';
import { Behandling } from '../../../../App/typer/fagsak';
import React, { useState } from 'react';
import useFormState, { FormState } from '../../../../App/hooks/felles/useFormState';
import { validerInnvilgetVedtakForm } from './vedtaksvalidering';
import { ListState } from '../../../../App/hooks/felles/useListState';
import AlertStripeFeilPreWrap from '../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { Button, Heading } from '@navikt/ds-react';
import UtgiftsperiodeValg, { tomUtgiftsperiodeRad } from './UtgiftsperiodeValg';
import KontantstøtteValg, { tomKontantstøtteRad } from './KontantstøtteValg';
import TilleggsstønadValg, { tomTilleggsstønadRad } from './Tilleggsstønadsvalg';
import { FieldState } from '../../../../App/hooks/felles/useFieldState';
import { useApp } from '../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import { useNavigate } from 'react-router-dom';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { UtregningstabellBarnetilsyn } from './UtregnignstabellBarnetilsyn';
import { IngenBegrunnelseOppgitt } from '../Overgangsstønad/InnvilgeVedtak/IngenBegrunnelseOppgitt';
import { EnsligTextArea } from '../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';

export type InnvilgeVedtakForm = {
    utgiftsperioder: IUtgiftsperiode[];
    kontantstøtteperioder?: IKontantstøttePeriode[];
    harKontantstøtte: ERadioValg;
    harTilleggsstønad: ERadioValg;
    tilleggsstønadBegrunnelse?: string;
    skalStønadReduseres: ERadioValg;
    tilleggsstønadsperioder?: ITilleggsstønadPeriode[];
    begrunnelse: string;
};

const WrapperDobbelMarginTop = styled.div`
    margin-top: 2rem;
`;

const WrapperMarginTop = styled.div`
    margin-top: 1rem;
`;

export const Vedtaksform: React.FC<{
    behandling: Behandling;
    lagretVedtak?: IvedtakForBarnetilsyn;
    barn: IBarnMedSamvær[];
}> = ({ lagretVedtak, behandling, barn }) => {
    const lagretInnvilgetVedtak =
        lagretVedtak?.resultatType === EBehandlingResultat.INNVILGE
            ? (lagretVedtak as IInnvilgeVedtakForBarnetilsyn)
            : undefined;
    const { behandlingErRedigerbar, hentBehandling } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');
    const [beregningsresultat, settBeregningsresultat] = useState(
        byggTomRessurs<IBeregeningsresultatBarnetilsyn[]>()
    );
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const navigate = useNavigate();

    const formState = useFormState<InnvilgeVedtakForm>(
        {
            utgiftsperioder: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.utgiftsperioder
                : [tomUtgiftsperiodeRad],
            harKontantstøtte: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.kontantstøtteperioder &&
                  lagretInnvilgetVedtak.kontantstøtteperioder.length > 0
                    ? ERadioValg.JA
                    : ERadioValg.NEI
                : ERadioValg.IKKE_SATT,
            kontantstøtteperioder: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.kontantstøtteperioder
                : [tomKontantstøtteRad],
            harTilleggsstønad: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.harTilleggsstønad
                : ERadioValg.IKKE_SATT,
            tilleggsstønadBegrunnelse: lagretInnvilgetVedtak?.tilleggsstønadBegrunnelse || '',
            skalStønadReduseres: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.skalStønadReduseres
                : ERadioValg.IKKE_SATT,
            tilleggsstønadsperioder: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.tilleggsstønadsperioder
                : [tomTilleggsstønadRad],
            begrunnelse: lagretInnvilgetVedtak?.begrunnelse || '',
        },
        validerInnvilgetVedtakForm
    );
    const utgiftsperiodeState = formState.getProps('utgiftsperioder') as ListState<IUtgiftsperiode>;
    const kontantstøtteState = formState.getProps('harKontantstøtte') as FieldState;
    const kontantstøttePeriodeState = formState.getProps(
        'kontantstøtteperioder'
    ) as ListState<IKontantstøttePeriode>;
    const tilleggsstønadState = formState.getProps('harTilleggsstønad') as FieldState;
    const tilleggsstønadBegrunnelseState = formState.getProps(
        'tilleggsstønadBegrunnelse'
    ) as FieldState;
    const stønadsreduksjonState = formState.getProps('skalStønadReduseres') as FieldState;
    const tilleggsstønadsperiodeState = formState.getProps(
        'tilleggsstønadsperioder'
    ) as ListState<ITilleggsstønadPeriode>;
    const begrunnelseState = formState.getProps('begrunnelse') as FieldState;

    const lagreVedtak = (vedtaksRequest: IInnvilgeVedtakForBarnetilsyn) => {
        settLaster(true);

        axiosRequest<string, IInnvilgeVedtakForBarnetilsyn>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandling.id}/fullfor`,
            data: vedtaksRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/simulering`))
            .finally(() => {
                settLaster(false);
            });

        settLaster(false);
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

    const handleSubmit = (form: FormState<InnvilgeVedtakForm>) => {
        const vedtaksRequest: IInnvilgeVedtakForBarnetilsyn = {
            resultatType: EBehandlingResultat.INNVILGE,
            utgiftsperioder: form.utgiftsperioder,
            kontantstøtteperioder:
                form.harKontantstøtte.value === ERadioValg.JA ? form.kontantstøtteperioder : [],
            harTilleggsstønad: form.harTilleggsstønad === ERadioValg.JA,
            tilleggsstønadBegrunnelse:
                form.harTilleggsstønad === ERadioValg.JA ? form.tilleggsstønadBegrunnelse : null,
            skalStønadReduseres: form.skalStønadReduseres === ERadioValg.JA,
            tilleggsstønadsperioder:
                form.harTilleggsstønad === ERadioValg.JA &&
                form.skalStønadReduseres === ERadioValg.JA
                    ? form.tilleggsstønadsperioder
                    : [],
            begrunnelse: form.begrunnelse,
            _type: 'InnvilgetBarnetilsyn', // TODO: Bruk enum
        };
        lagreVedtak(vedtaksRequest);
    };

    const beregnBarnetilsyn = () => {
        if (formState.validateForm()) {
            axiosRequest<IBeregeningsresultatBarnetilsyn[], IBeregningsrequestBarnetilsyn>({
                method: 'POST',
                url: `/familie-ef-sak/api/beregning/`,
                data: {
                    utgiftsperioder: utgiftsperiodeState.value,
                    kontantstøtteperioder: kontantstøttePeriodeState.value,
                    tilleggsstønadsperioder: tilleggsstønadsperiodeState.value,
                },
            }).then((res: Ressurs<IBeregeningsresultatBarnetilsyn[]>) =>
                settBeregningsresultat(res)
            );
        }
    };

    return (
        <form onSubmit={formState.onSubmit(handleSubmit)}>
            <Heading spacing size="small" level="5">
                Utgifter til barnetilsyn
            </Heading>
            <UtgiftsperiodeValg
                utgiftsperioder={utgiftsperiodeState}
                valideringsfeil={formState.errors.utgiftsperioder}
                settValideringsFeil={formState.setErrors}
                barn={barn}
            />
            <WrapperMarginTop>
                <Heading spacing size="small" level="5">
                    Kontantstøtte
                </Heading>
                <KontantstøtteValg
                    kontantstøtte={kontantstøtteState}
                    kontantstøttePerioder={kontantstøttePeriodeState}
                    valideringsfeil={formState.errors}
                    settValideringsFeil={formState.setErrors}
                />
            </WrapperMarginTop>
            <WrapperMarginTop>
                <Heading spacing size="small" level="5">
                    Tilleggsstønadsforskriften
                </Heading>
                <TilleggsstønadValg
                    tilleggsstønad={tilleggsstønadState}
                    tilleggsstønadBegrunnelse={tilleggsstønadBegrunnelseState}
                    stønadsreduksjon={stønadsreduksjonState}
                    tilleggsstønadPerioder={tilleggsstønadsperiodeState}
                    valideringsfeil={formState.errors}
                    settValideringsfeil={formState.setErrors}
                />
            </WrapperMarginTop>
            {feilmelding && (
                <AlertStripeFeilPreWrap style={{ marginTop: '2rem' }}>
                    {feilmelding}
                </AlertStripeFeilPreWrap>
            )}
            {behandlingErRedigerbar && (
                <WrapperDobbelMarginTop>
                    <Button variant={'secondary'} onClick={beregnBarnetilsyn} type={'button'}>
                        Beregn
                    </Button>
                </WrapperDobbelMarginTop>
            )}
            <WrapperDobbelMarginTop>
                <UtregningstabellBarnetilsyn beregningsresultat={beregningsresultat} />
            </WrapperDobbelMarginTop>
            <WrapperDobbelMarginTop>
                {!behandlingErRedigerbar && begrunnelseState.value === '' ? (
                    <IngenBegrunnelseOppgitt />
                ) : (
                    <EnsligTextArea
                        erLesevisning={!behandlingErRedigerbar}
                        value={begrunnelseState.value}
                        onChange={(event) => {
                            settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                            begrunnelseState.onChange(event);
                        }}
                        label={'Begrunnelse'}
                        maxLength={0}
                        feilmelding={formState.errors.begrunnelse}
                    />
                )}
            </WrapperDobbelMarginTop>
            {behandlingErRedigerbar && (
                <WrapperDobbelMarginTop>
                    <Button variant="primary" disabled={laster} type={'submit'}>
                        Lagre vedtak
                    </Button>
                </WrapperDobbelMarginTop>
            )}
        </form>
    );
};
