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
import { useBehandling } from '../../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';
import UtgiftsperiodeValg from './UtgiftsperiodeValg';
import KontantstøtteValg, { tomKontantstøtteRad } from './KontantstøtteValg';
import TilleggsstønadValg, { tomTilleggsstønadRad } from './Tilleggsstønadsvalg';
import { FieldState } from '../../../../App/hooks/felles/useFieldState';
import { useApp } from '../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { UtregningstabellBarnetilsyn } from './UtregnignstabellBarnetilsyn';
import { blirNullUtbetalingPgaOverstigendeKontantstøtte } from '../Felles/utils';
import { tomUtgiftsperiodeRad } from './utils';
import { useRedirectEtterLagring } from '../../../../App/hooks/felles/useRedirectEtterLagring';
import { v4 as uuidv4 } from 'uuid';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';
import HovedKnapp from '../../../../Felles/Knapper/HovedKnapp';

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

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Utregningstabell = styled(UtregningstabellBarnetilsyn)`
    margin-left: 1rem;
`;

const initKontantstøttestate = (
    vedtak: IInnvilgeVedtakForBarnetilsyn | undefined,
    harKontantstøtteUtbetalinger?: boolean
) =>
    vedtak
        ? vedtak.perioderKontantstøtte && vedtak.perioderKontantstøtte.length > 0
            ? ERadioValg.JA
            : ERadioValg.NEI
        : harKontantstøtteUtbetalinger
        ? ERadioValg.IKKE_SATT
        : ERadioValg.NEI;

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

const initFormState = (
    vedtak: IInnvilgeVedtakForBarnetilsyn | undefined,
    harKontantstøtteUtbetalinger?: boolean
) => ({
    utgiftsperioder: initUtgiftsperioder(vedtak),
    harKontantstøtte: initKontantstøttestate(vedtak, harKontantstøtteUtbetalinger),
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
    harKontantstøtteUtbetalinger: boolean;
}> = ({
    lagretVedtak,
    behandling,
    barn,
    settResultatType,
    låsFraDatoFørsteRad,
    harKontantstøtteUtbetalinger,
}) => {
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
    const { utførRedirect } = useRedirectEtterLagring(`/behandling/${behandling.id}/simulering`);

    const formState = useFormState<InnvilgeVedtakForm>(
        initFormState(lagretInnvilgetVedtak, harKontantstøtteUtbetalinger),
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
        kontantstøtteState.setValue(
            initKontantstøttestate(lagretInnvilgetVedtak, harKontantstøtteUtbetalinger)
        );
        kontantstøttePeriodeState.setValue(initKontantstøtteperioder(lagretInnvilgetVedtak));
        tilleggsstønadState.setValue(initHarTilleggsstønad(lagretInnvilgetVedtak));
        stønadsreduksjonState.setValue(initSkalStønadReduseres(lagretInnvilgetVedtak));
        tilleggsstønadsperiodeState.setValue(initTillegsstønadsperioder(lagretInnvilgetVedtak));
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
        nullstillIkkePersisterteKomponenter();
        axiosRequest<string, IInnvilgeVedtakForBarnetilsyn>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandling.id}/lagre-vedtak`,
            data: vedtaksRequest,
        })
            .then(håndterVedtaksresultat())
            .finally(() => {
                settLaster(false);
            });
    };

    const håndterVedtaksresultat = () => {
        return (res: Ressurs<string>) => {
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    utførRedirect();
                    hentBehandling.rerun();
                    break;
                case RessursStatus.HENTER:
                case RessursStatus.IKKE_HENTET:
                    break;
                default:
                    settIkkePersistertKomponent(uuidv4());
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
                url: `/familie-ef-sak/api/beregning/barnetilsyn`,
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
        <Form onSubmit={formState.onSubmit(handleSubmit)}>
            <UtgiftsperiodeValg
                begrunnelseState={begrunnelseState}
                errorState={formState.errors}
                utgiftsperioderState={utgiftsperiodeState}
                settValideringsFeil={formState.setErrors}
                barn={barn}
                låsFraDatoFørsteRad={låsFraDatoFørsteRad}
            />
            <KontantstøtteValg
                erLesevisning={!behandlingErRedigerbar}
                kontantstøtte={kontantstøtteState}
                kontantstøttePerioder={kontantstøttePeriodeState}
                settValideringsFeil={formState.setErrors}
                valideringsfeil={formState.errors}
                finnesKontantstøtteUtbetaling={finnesKontantstøtteUtbetaling}
            />
            <TilleggsstønadValg
                erLesevisning={!behandlingErRedigerbar}
                settValideringsfeil={formState.setErrors}
                stønadsreduksjon={stønadsreduksjonState}
                tilleggsstønad={tilleggsstønadState}
                tilleggsstønadBegrunnelse={tilleggsstønadBegrunnelseState}
                tilleggsstønadPerioder={tilleggsstønadsperiodeState}
                valideringsfeil={formState.errors}
            />
            {behandlingErRedigerbar && (
                <div>
                    <Button variant={'secondary'} onClick={beregnBarnetilsyn} type={'button'}>
                        Beregn
                    </Button>
                    {feilmelding && <AlertError>{feilmelding}</AlertError>}
                </div>
            )}
            <Utregningstabell beregningsresultat={beregningsresultat} />
            {behandlingErRedigerbar && <HovedKnapp disabled={laster} knappetekst="Lagre vedtak" />}
        </Form>
    );
};
