import {
    EBehandlingResultat,
    ERadioValg,
    IBeregningsperiodeBarnetilsyn,
    IBeregningsrequestBarnetilsyn,
    IInnvilgeVedtakForBarnetilsyn,
    IPeriodeMedBeløp,
    IUtgiftsperiode,
    IvedtakForBarnetilsyn,
    IVedtakType,
} from '../../../../App/typer/vedtak';
import { Behandling } from '../../../../App/typer/fagsak';
import React, { useEffect, useState } from 'react';
import useFormState, { FormState } from '../../../../App/hooks/felles/useFormState';
import { validerInnvilgetVedtakForm, validerPerioder } from './vedtaksvalidering';
import { ListState } from '../../../../App/hooks/felles/useListState';
import AlertStripeFeilPreWrap from '../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { Button, Heading } from '@navikt/ds-react';
import UtgiftsperiodeValg from './UtgiftsperiodeValg';
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
import { blirNullUtbetalingPgaOverstigendeKontantstøtte } from '../Felles/utils';
import { tomUtgiftsperiodeRad } from './utils';

export type InnvilgeVedtakForm = {
    utgiftsperioder: IUtgiftsperiode[];
    kontantstøtteperioder?: IPeriodeMedBeløp[];
    harKontantstøtte: ERadioValg;
    harTilleggsstønad: ERadioValg;
    tilleggsstønadBegrunnelse?: string;
    skalStønadReduseres: ERadioValg;
    tilleggsstønadsperioder?: IPeriodeMedBeløp[];
    begrunnelse?: string;
};

const WrapperDobbelMarginTop = styled.div`
    margin-top: 2rem;
`;

const WrapperMarginTop = styled.div`
    margin-top: 1rem;
`;

const initKontantstøttestate = (vedtak: IInnvilgeVedtakForBarnetilsyn | undefined) =>
    vedtak
        ? vedtak.perioderKontantstøtte && vedtak.perioderKontantstøtte.length > 0
            ? ERadioValg.JA
            : ERadioValg.NEI
        : ERadioValg.IKKE_SATT;

const initKontantstøtteperioder = (vedtak: IInnvilgeVedtakForBarnetilsyn | undefined) =>
    vedtak ? vedtak.perioderKontantstøtte : [tomKontantstøtteRad()];

const initHarTilleggsstønad = (vedtak: IInnvilgeVedtakForBarnetilsyn | undefined) =>
    vedtak
        ? vedtak.tilleggsstønad.harTilleggsstønad
            ? ERadioValg.JA
            : ERadioValg.NEI
        : ERadioValg.IKKE_SATT;

const initSkalStønadReduseres = (vedtak: IInnvilgeVedtakForBarnetilsyn | undefined) =>
    vedtak && vedtak.tilleggsstønad.harTilleggsstønad
        ? vedtak.tilleggsstønad.perioder.length > 0
            ? ERadioValg.JA
            : ERadioValg.NEI
        : ERadioValg.IKKE_SATT;

const initTillegsstønadsperioder = (vedtak: IInnvilgeVedtakForBarnetilsyn | undefined) =>
    vedtak ? vedtak.tilleggsstønad.perioder : [tomTilleggsstønadRad()];

const initUtgiftsperioder = (vedtak: IInnvilgeVedtakForBarnetilsyn | undefined) =>
    vedtak ? vedtak.perioder : [tomUtgiftsperiodeRad()];

const initFormState = (vedtak: IInnvilgeVedtakForBarnetilsyn | undefined) => ({
    utgiftsperioder: initUtgiftsperioder(vedtak),
    harKontantstøtte: initKontantstøttestate(vedtak),
    kontantstøtteperioder: initKontantstøtteperioder(vedtak),
    harTilleggsstønad: initHarTilleggsstønad(vedtak),
    tilleggsstønadBegrunnelse: vedtak?.tilleggsstønad.begrunnelse || '',
    skalStønadReduseres: initSkalStønadReduseres(vedtak),
    tilleggsstønadsperioder: initTillegsstønadsperioder(vedtak),
    begrunnelse: vedtak?.begrunnelse || '',
});

const initNullUtbetalingPgaKontantstøtte = (
    lagretInnvilgetVedtak: IInnvilgeVedtakForBarnetilsyn | undefined
) => lagretInnvilgetVedtak?._type === IVedtakType.InnvilgelseBarnetilsynUtenUtbetaling;

export const Vedtaksform: React.FC<{
    behandling: Behandling;
    lagretVedtak?: IvedtakForBarnetilsyn;
    barn: IBarnMedSamvær[];
    settResultatType: (val: EBehandlingResultat | undefined) => void;
    låsFraDatoFørsteRad: boolean;
}> = ({ lagretVedtak, behandling, barn, settResultatType, låsFraDatoFørsteRad }) => {
    const lagretInnvilgetVedtak =
        lagretVedtak?._type === IVedtakType.InnvilgelseBarnetilsyn ||
        lagretVedtak?._type === IVedtakType.InnvilgelseBarnetilsynUtenUtbetaling
            ? (lagretVedtak as IInnvilgeVedtakForBarnetilsyn)
            : undefined;
    const { behandlingErRedigerbar, hentBehandling } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');
    const [nullUtbetalingPgaKontantstøtte, settNullUtbetalingPgaKontantstøtte] = useState(
        initNullUtbetalingPgaKontantstøtte(lagretInnvilgetVedtak)
    ); // Trenger denne reset?
    const [beregningsresultat, settBeregningsresultat] = useState(
        byggTomRessurs<IBeregningsperiodeBarnetilsyn[]>()
    );
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const navigate = useNavigate();

    const formState = useFormState<InnvilgeVedtakForm>(
        initFormState(lagretInnvilgetVedtak),
        validerInnvilgetVedtakForm
    );

    const utgiftsperiodeState = formState.getProps('utgiftsperioder') as ListState<IUtgiftsperiode>;
    const kontantstøtteState = formState.getProps('harKontantstøtte') as FieldState;
    const kontantstøttePeriodeState = formState.getProps(
        'kontantstøtteperioder'
    ) as ListState<IPeriodeMedBeløp>;
    const tilleggsstønadState = formState.getProps('harTilleggsstønad') as FieldState;
    const tilleggsstønadBegrunnelseState = formState.getProps(
        'tilleggsstønadBegrunnelse'
    ) as FieldState;
    const stønadsreduksjonState = formState.getProps('skalStønadReduseres') as FieldState;
    const tilleggsstønadsperiodeState = formState.getProps(
        'tilleggsstønadsperioder'
    ) as ListState<IPeriodeMedBeløp>;
    const begrunnelseState = formState.getProps('begrunnelse') as FieldState;

    useEffect(() => {
        if (!lagretInnvilgetVedtak) {
            return;
        }
        utgiftsperiodeState.setValue(initUtgiftsperioder(lagretInnvilgetVedtak));
        kontantstøtteState.setValue(initKontantstøttestate(lagretInnvilgetVedtak));
        kontantstøttePeriodeState.setValue(initKontantstøtteperioder(lagretInnvilgetVedtak));
        tilleggsstønadState.setValue(initHarTilleggsstønad(lagretInnvilgetVedtak));
        stønadsreduksjonState.setValue(initSkalStønadReduseres(lagretInnvilgetVedtak));
        tilleggsstønadsperiodeState.setValue(initTillegsstønadsperioder(lagretInnvilgetVedtak));
        utgiftsperiodeState.setValue(initUtgiftsperioder(lagretInnvilgetVedtak));
        formState.setErrors((prevState) => ({
            ...prevState,
            utgiftsperioder: [],
            tilleggsstønadsperioder: [],
            kontantstøtteperioder: [],
        }));

        // eslint-disable-next-line
    }, [lagretInnvilgetVedtak]);

    const lagreVedtak = (vedtaksRequest: IInnvilgeVedtakForBarnetilsyn) => {
        settLaster(true);

        axiosRequest<string, IInnvilgeVedtakForBarnetilsyn>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandling.id}/lagre-vedtak`,
            data: vedtaksRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/simulering`))
            .finally(() => {
                settLaster(false);
            });
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
            perioder: form.utgiftsperioder,
            perioderKontantstøtte:
                form.harKontantstøtte === ERadioValg.JA ? form.kontantstøtteperioder : [],
            tilleggsstønad: {
                harTilleggsstønad: form.harTilleggsstønad === ERadioValg.JA,
                perioder:
                    form.harTilleggsstønad === ERadioValg.JA &&
                    form.skalStønadReduseres === ERadioValg.JA
                        ? form.tilleggsstønadsperioder
                        : [],
                begrunnelse:
                    form.harTilleggsstønad === ERadioValg.JA
                        ? form.tilleggsstønadBegrunnelse
                        : null,
            },
            begrunnelse: form.begrunnelse,
            _type: nullUtbetalingPgaKontantstøtte
                ? IVedtakType.InnvilgelseBarnetilsynUtenUtbetaling
                : IVedtakType.InnvilgelseBarnetilsyn,
        };
        lagreVedtak(vedtaksRequest);
    };

    const beregnBarnetilsyn = () => {
        if (formState.customValidate(validerPerioder)) {
            axiosRequest<IBeregningsperiodeBarnetilsyn[], IBeregningsrequestBarnetilsyn>({
                method: 'POST',
                url: `/familie-ef-sak/api/beregning/barnetilsyn/`,
                data: {
                    utgiftsperioder: utgiftsperiodeState.value,
                    kontantstøtteperioder:
                        kontantstøtteState.value === ERadioValg.JA
                            ? kontantstøttePeriodeState.value
                            : [],
                    tilleggsstønadsperioder:
                        tilleggsstønadState.value === ERadioValg.JA &&
                        stønadsreduksjonState.value === ERadioValg.JA
                            ? tilleggsstønadsperiodeState.value
                            : [],
                },
            }).then((res: Ressurs<IBeregningsperiodeBarnetilsyn[]>) => settBeregningsresultat(res));
        }
    };

    useEffect(() => {
        if (!behandlingErRedigerbar) {
            axiosRequest<IBeregningsperiodeBarnetilsyn[], null>({
                method: 'GET',
                url: `/familie-ef-sak/api/beregning/barnetilsyn/${behandling.id}`,
            }).then((res: Ressurs<IBeregningsperiodeBarnetilsyn[]>) => settBeregningsresultat(res));
        }
        // eslint-disable-next-line
    }, [behandlingErRedigerbar]);

    useEffect(() => {
        if (beregningsresultat.status === RessursStatus.SUKSESS) {
            const kontantstøttebeløpOverstigerUtgiftsbeløpForAllePerioder =
                blirNullUtbetalingPgaOverstigendeKontantstøtte(beregningsresultat.data);
            settNullUtbetalingPgaKontantstøtte(
                kontantstøttebeløpOverstigerUtgiftsbeløpForAllePerioder
            );
            if (kontantstøttebeløpOverstigerUtgiftsbeløpForAllePerioder) {
                settResultatType(EBehandlingResultat.INNVILGE_UTEN_UTBETALING);
            } else {
                settResultatType(EBehandlingResultat.INNVILGE);
            }
        }
    }, [beregningsresultat, settResultatType]);

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
                låsFraDatoFørsteRad={låsFraDatoFørsteRad}
            />
            <div>
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
                        label={'Begrunnelse for vedtaksperiode'}
                        maxLength={0}
                        feilmelding={formState.errors.begrunnelse}
                    />
                )}
            </div>
            <WrapperDobbelMarginTop>
                <Heading spacing size="small" level="5">
                    Kontantstøtte
                </Heading>
                <KontantstøtteValg
                    kontantstøtte={kontantstøtteState}
                    kontantstøttePerioder={kontantstøttePeriodeState}
                    valideringsfeil={formState.errors}
                    settValideringsFeil={formState.setErrors}
                />
            </WrapperDobbelMarginTop>
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
