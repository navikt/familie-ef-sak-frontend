import {
    IBeregningSkolepengerResponse,
    IBeregningsrequestSkolepenger,
    IInnvilgeVedtakForSkolepenger,
    ISkoleårsperiodeSkolepenger,
    IvedtakForSkolepenger,
    IVedtakType,
} from '../../../../App/typer/vedtak';
import { Behandling } from '../../../../App/typer/fagsak';
import React, { useEffect, useState } from 'react';
import useFormState, { FormState } from '../../../../App/hooks/felles/useFormState';
import { ListState } from '../../../../App/hooks/felles/useListState';
import AlertStripeFeilPreWrap from '../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { Button, Heading } from '@navikt/ds-react';
import { FieldState } from '../../../../App/hooks/felles/useFieldState';
import { useApp } from '../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import { useNavigate } from 'react-router-dom';
import { IngenBegrunnelseOppgitt } from '../Overgangsstønad/InnvilgeVedtak/IngenBegrunnelseOppgitt';
import { EnsligTextArea } from '../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import { UtregningstabellSkolepenger } from './UtregnignstabellSkolepenger';
import Skoleårsperioder, { tomSkoleårsperiodeSkolepenger } from './UtgiftsperiodeSkolepenger';
import { validerInnvilgetVedtakForm, validerPerioder } from './vedtaksvalidering';

export type InnvilgeVedtakForm = {
    perioder: ISkoleårsperiodeSkolepenger[];
    begrunnelse?: string;
};

const WrapperDobbelMarginTop = styled.div`
    margin-top: 2rem;
`;

export const VedtaksformSkolepenger: React.FC<{
    behandling: Behandling;
    lagretInnvilgetVedtak?: IvedtakForSkolepenger;
}> = ({ lagretInnvilgetVedtak, behandling }) => {
    const { behandlingErRedigerbar, hentBehandling } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');

    const [beregningsresultat, settBeregningsresultat] = useState(
        byggTomRessurs<IBeregningSkolepengerResponse>()
    );
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const navigate = useNavigate();

    const formState = useFormState<InnvilgeVedtakForm>(
        {
            perioder: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.perioder
                : [tomSkoleårsperiodeSkolepenger],
            begrunnelse: lagretInnvilgetVedtak?.begrunnelse || '',
        },
        validerInnvilgetVedtakForm
    );
    const skoleårsPerioderState = formState.getProps(
        'perioder'
    ) as ListState<ISkoleårsperiodeSkolepenger>;
    const begrunnelseState = formState.getProps('begrunnelse') as FieldState;

    const lagreVedtak = (vedtaksRequest: IInnvilgeVedtakForSkolepenger) => {
        settLaster(true);

        axiosRequest<string, IInnvilgeVedtakForSkolepenger>({
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
        const vedtaksRequest: IInnvilgeVedtakForSkolepenger = {
            perioder: form.perioder,
            begrunnelse: form.begrunnelse,
            _type: IVedtakType.InnvilgelseSkolepenger,
        };
        lagreVedtak(vedtaksRequest);
    };

    const beregnSkolepenger = () => {
        if (formState.customValidate(validerPerioder)) {
            axiosRequest<IBeregningSkolepengerResponse, IBeregningsrequestSkolepenger>({
                method: 'POST',
                url: `/familie-ef-sak/api/beregning/skolepenger/`,
                data: {
                    behandlingId: behandling.id,
                    skoleårsperioder: skoleårsPerioderState.value,
                },
            }).then((res: Ressurs<IBeregningSkolepengerResponse>) => settBeregningsresultat(res));
        }
    };

    useEffect(() => {
        if (!behandlingErRedigerbar) {
            axiosRequest<IBeregningSkolepengerResponse, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/beregning/skolepenger/${behandling.id}`,
            }).then((res: Ressurs<IBeregningSkolepengerResponse>) => settBeregningsresultat(res));
        }
    }, [axiosRequest, behandling, behandlingErRedigerbar]);
    return (
        <form onSubmit={formState.onSubmit(handleSubmit)}>
            <Heading spacing size="small" level="5">
                Utgifter til skolepenger
            </Heading>
            <Skoleårsperioder
                skoleårsperioder={skoleårsPerioderState}
                valideringsfeil={formState.errors.perioder}
                settValideringsFeil={formState.setErrors}
            />
            {feilmelding && (
                <AlertStripeFeilPreWrap style={{ marginTop: '2rem' }}>
                    {feilmelding}
                </AlertStripeFeilPreWrap>
            )}
            {behandlingErRedigerbar && (
                <WrapperDobbelMarginTop>
                    <Button variant={'secondary'} onClick={beregnSkolepenger} type={'button'}>
                        Beregn
                    </Button>
                </WrapperDobbelMarginTop>
            )}
            <WrapperDobbelMarginTop>
                <UtregningstabellSkolepenger beregningsresultat={beregningsresultat} />
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
