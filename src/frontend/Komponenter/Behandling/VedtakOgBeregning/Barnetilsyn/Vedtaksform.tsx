import {
    EBehandlingResultat,
    ERadioValg,
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

export type InnvilgeVedtakForm = {
    utgiftsperioder: IUtgiftsperiode[];
    kontantstøtteperioder?: IKontantstøttePeriode[];
    harKontantstøtte: ERadioValg;
    harTilleggsstønad: ERadioValg;
    tilleggsstønadBegrunnelse?: string;
    skalStønadReduseres: ERadioValg;
    tilleggsstønadsperioder?: ITilleggsstønadPeriode[];
};

const WrapperDobbelMarginTop = styled.div`
    margin-top: 2rem;
`;

const WrapperMarginTop = styled.div`
    margin-top: 1rem;
`;

export const Vedtaksform: React.FC<{
    behandling?: Behandling;
    lagretVedtak?: IvedtakForBarnetilsyn;
}> = ({ lagretVedtak }) => {
    const lagretInnvilgetVedtak =
        lagretVedtak?.resultatType === EBehandlingResultat.INNVILGE
            ? (lagretVedtak as IInnvilgeVedtakForBarnetilsyn)
            : undefined;
    const { behandlingErRedigerbar } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding] = useState<string>();

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

    const lagreVedtak = (vedtaksRequest: IInnvilgeVedtakForBarnetilsyn) => {
        settLaster(true);
        console.log(vedtaksRequest);
        settLaster(false);
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
        };
        lagreVedtak(vedtaksRequest);
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
            />
            <WrapperMarginTop>
                <Heading spacing size="small" level="5">
                    Kontantstøtte
                </Heading>
                <KontantstøtteValg
                    kontantstøtte={kontantstøtteState}
                    kontantstøttePerioder={kontantstøttePeriodeState}
                    valideringsfeil={formState.errors.kontantstøtteperioder}
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
                    periodeValideringsfeil={formState.errors.tilleggsstønadsperioder}
                    settPeriodeValideringsfeil={formState.setErrors}
                    begrunnelseValideringsfeil={formState.errors.tilleggsstønadBegrunnelse}
                />
            </WrapperMarginTop>
            {feilmelding && (
                <AlertStripeFeilPreWrap style={{ marginTop: '2rem' }}>
                    {feilmelding}
                </AlertStripeFeilPreWrap>
            )}
            {behandlingErRedigerbar && (
                <WrapperDobbelMarginTop>
                    <Button variant="primary" disabled={laster}>
                        Lagre vedtak
                    </Button>
                </WrapperDobbelMarginTop>
            )}
        </form>
    );
};
