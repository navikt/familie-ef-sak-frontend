import {
    IBeregningSkolepengerResponse,
    IBeregningsrequestSkolepenger,
    ISkoleårsperiodeSkolepenger,
    IVedtakForSkolepenger,
    IvedtakForSkolepenger,
    IVedtakType,
} from '../../../../../App/typer/vedtak';
import { Behandling } from '../../../../../App/typer/fagsak';
import React, { useEffect, useState } from 'react';
import useFormState, { FormState } from '../../../../../App/hooks/felles/useFormState';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import AlertStripeFeilPreWrap from '../../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { Button, Heading } from '@navikt/ds-react';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { useApp } from '../../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../../App/typer/ressurs';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { UtregningstabellSkolepenger } from '../UtregnignstabellSkolepenger';
import {
    validerInnvilgetVedtakForm,
    validerInnvilgetVedtakFormBeregning,
} from './vedtaksvalidering';
import { tomSkoleårsperiodeSkolepenger } from '../typer';
import SkoleårsperioderSkolepenger from './SkoleårsperioderSkolepenger';
import OpphørSkolepenger from '../OpphørSkolepenger/OpphørSkolepenger';
import { BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import { AGray50, ARed500 } from '@navikt/ds-tokens/dist/tokens';
import { useRedirectEtterLagring } from '../../../../../App/hooks/felles/useRedirectEtterLagring';
import { v4 as uuidv4 } from 'uuid';

const WrapperDobbelMarginTop = styled.div`
    margin-top: 2rem;
`;

const BeregnKnapp = styled(Button)`
    margin: 2rem 1rem;
`;

export const AdvarselTekst = styled(BodyShortSmall)`
    color: ${ARed500};
`;

const Container = styled.section`
    margin-top: 1rem;
    padding: 1rem;
`;

const InputContainer = styled(Container)`
    background-color: ${AGray50};
`;

export const defaultSkoleårsperioder = (
    forrigeVedtak?: IvedtakForSkolepenger
): ISkoleårsperiodeSkolepenger[] => {
    const forrigeSkoleårsperioder = forrigeVedtak?.skoleårsperioder;
    if (forrigeSkoleårsperioder && forrigeSkoleårsperioder.length > 0) {
        return forrigeSkoleårsperioder;
    } else {
        return [tomSkoleårsperiodeSkolepenger()];
    }
};

export type InnvilgeVedtakForm = {
    skoleårsperioder: ISkoleårsperiodeSkolepenger[];
    begrunnelse?: string;
};

export const VedtaksformSkolepenger: React.FC<{
    behandling: Behandling;
    erOpphør: boolean;
    lagretInnvilgetVedtak?: IvedtakForSkolepenger;
    forrigeVedtak?: IvedtakForSkolepenger;
}> = ({ behandling, erOpphør, lagretInnvilgetVedtak, forrigeVedtak }) => {
    const { behandlingErRedigerbar, hentBehandling } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');
    const [harUtførtBeregning, settHarUtførtBeregning] = useState<boolean>(false);
    const [visFeilmelding, settVisFeilmelding] = useState<boolean>(false);

    const [beregningsresultat, settBeregningsresultat] = useState(
        byggTomRessurs<IBeregningSkolepengerResponse>()
    );
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const { utførRedirect } = useRedirectEtterLagring(`/behandling/${behandling.id}/simulering`);
    const formState = useFormState<InnvilgeVedtakForm>(
        {
            skoleårsperioder: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.skoleårsperioder
                : defaultSkoleårsperioder(forrigeVedtak),
            begrunnelse: lagretInnvilgetVedtak?.begrunnelse || '',
        },
        validerInnvilgetVedtakForm
    );
    const skoleårsPerioderState = formState.getProps(
        'skoleårsperioder'
    ) as ListState<ISkoleårsperiodeSkolepenger>;
    const begrunnelseState = formState.getProps('begrunnelse') as FieldState;

    const utgiftsIderForrigeBehandling = forrigeVedtak
        ? forrigeVedtak.skoleårsperioder.flatMap((p) => p.utgiftsperioder.map((u) => u.id))
        : [];

    const lagreVedtak = (vedtaksRequest: IVedtakForSkolepenger) => {
        settLaster(true);
        nullstillIkkePersisterteKomponenter();
        axiosRequest<string, IVedtakForSkolepenger>({
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
        settVisFeilmelding(false);
        if (harUtførtBeregning || erOpphør) {
            const vedtaksRequest: IVedtakForSkolepenger = {
                skoleårsperioder: form.skoleårsperioder,
                begrunnelse: form.begrunnelse,
                _type: erOpphør
                    ? IVedtakType.OpphørSkolepenger
                    : IVedtakType.InnvilgelseSkolepenger,
            };
            lagreVedtak(vedtaksRequest);
        } else {
            settVisFeilmelding(true);
        }
    };

    const beregnSkolepenger = () => {
        settHarUtførtBeregning(false);
        settVisFeilmelding(false);
        if (formState.customValidate(validerInnvilgetVedtakFormBeregning)) {
            axiosRequest<IBeregningSkolepengerResponse, IBeregningsrequestSkolepenger>({
                method: 'POST',
                url: `/familie-ef-sak/api/beregning/skolepenger`,
                data: {
                    behandlingId: behandling.id,
                    skoleårsperioder: skoleårsPerioderState.value,
                    erOpphør: erOpphør,
                },
            }).then((res: Ressurs<IBeregningSkolepengerResponse>) => {
                settBeregningsresultat(res);
                settHarUtførtBeregning(true);
            });
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
            <InputContainer>
                <Heading spacing size="small" level="5">
                    Utgifter til skolepenger
                </Heading>
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
            </InputContainer>
            {!erOpphør ? (
                <SkoleårsperioderSkolepenger
                    skoleårsperioder={skoleårsPerioderState}
                    låsteUtgiftIder={utgiftsIderForrigeBehandling}
                    valideringsfeil={formState.errors.skoleårsperioder}
                    settValideringsFeil={formState.setErrors}
                    oppdaterHarUtførtBeregning={settHarUtførtBeregning}
                />
            ) : (
                <OpphørSkolepenger
                    skoleårsperioder={skoleårsPerioderState}
                    forrigeSkoleårsperioder={forrigeVedtak?.skoleårsperioder || []}
                    valideringsfeil={formState.errors.skoleårsperioder}
                    settValideringsFeil={formState.setErrors}
                />
            )}
            {feilmelding && (
                <AlertStripeFeilPreWrap style={{ marginTop: '2rem' }}>
                    {feilmelding}
                </AlertStripeFeilPreWrap>
            )}
            {behandlingErRedigerbar && !erOpphør && (
                <>
                    <BeregnKnapp variant={'secondary'} onClick={beregnSkolepenger} type={'button'}>
                        Beregn
                    </BeregnKnapp>
                    {visFeilmelding && (
                        <AdvarselTekst>
                            Kan ikke lagre vedtaket før beregning er utført
                        </AdvarselTekst>
                    )}
                </>
            )}
            <WrapperDobbelMarginTop>
                <UtregningstabellSkolepenger
                    beregningsresultat={beregningsresultat}
                    skjulVisning={behandlingErRedigerbar && !harUtførtBeregning}
                />
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
