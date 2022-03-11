import {
    EBehandlingResultat,
    EKontantstøtte,
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

export type InnvilgeVedtakForm = Omit<IInnvilgeVedtakForBarnetilsyn, 'resultatType'>;

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
            kontantstøtte: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.kontantstøtte
                : EKontantstøtte.NEI,
            kontantstøtteperioder: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.kontantstøtteperioder
                : [tomKontantstøtteRad],
            tilleggsstønadsperioder: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.tilleggsstønadsperioder
                : [tomTilleggsstønadRad],
        },
        validerInnvilgetVedtakForm
    );
    const utgiftsperiodeState = formState.getProps('utgiftsperioder') as ListState<IUtgiftsperiode>;
    const kontantstøtteState = formState.getProps('kontantstøtte') as FieldState;
    const kontantstøttePeriodeState = formState.getProps(
        'kontantstøtteperioder'
    ) as ListState<IKontantstøttePeriode>;
    const tilleggsstønadState = formState.getProps(
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
            kontantstøtte: form.kontantstøtte,
            kontantstøtteperioder:
                form.kontantstøtte.value === EKontantstøtte.JA ? form.kontantstøtteperioder : null,
            tilleggsstønadsperioder: form.tilleggsstønadsperioder,
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
                    tilleggsstønadPerioder={tilleggsstønadState}
                    valideringsfeil={formState.errors.tilleggsstønadsperioder}
                    settValideringsFeil={formState.setErrors}
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
