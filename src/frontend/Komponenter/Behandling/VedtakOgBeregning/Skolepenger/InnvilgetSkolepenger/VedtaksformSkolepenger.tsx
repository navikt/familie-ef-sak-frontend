import {
    IBeregningSkolepengerResponse,
    IBeregningsrequestSkolepenger,
    IInnvilgeVedtakForSkolepenger,
    ISkoleårsperiodeSkolepenger,
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
import { useNavigate } from 'react-router-dom';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { UtregningstabellSkolepenger } from '../UtregnignstabellSkolepenger';
import {
    validerInnvilgetVedtakForm,
    validerInnvilgetVedtakFormBeregning,
} from './vedtaksvalidering';
import { tomSkoleårsperiodeSkolepenger } from '../typer';
import SkoleårsperioderSkolepenger from './SkoleårsperioderSkolepenger';
import { Normaltekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';

export type InnvilgeVedtakForm = {
    skoleårsperioder: ISkoleårsperiodeSkolepenger[];
    begrunnelse?: string;
};

const WrapperDobbelMarginTop = styled.div`
    margin-top: 2rem;
`;

export const AdvarselTekst = styled(Normaltekst)`
    color: ${navFarger.redError};
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

export const VedtaksformSkolepenger: React.FC<{
    behandling: Behandling;
    lagretInnvilgetVedtak?: IvedtakForSkolepenger;
    forrigeVedtak?: IvedtakForSkolepenger;
}> = ({ behandling, lagretInnvilgetVedtak, forrigeVedtak }) => {
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
    const navigate = useNavigate();
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

    const oppdaterHarUtførtBeregning = (harUtførtBeregning: boolean) => {
        settHarUtførtBeregning(harUtførtBeregning);
    };

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
        settVisFeilmelding(false);
        if (harUtførtBeregning) {
            const vedtaksRequest: IInnvilgeVedtakForSkolepenger = {
                skoleårsperioder: form.skoleårsperioder,
                begrunnelse: form.begrunnelse,
                _type: IVedtakType.InnvilgelseSkolepenger,
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
                url: `/familie-ef-sak/api/beregning/skolepenger/`,
                data: {
                    behandlingId: behandling.id,
                    skoleårsperioder: skoleårsPerioderState.value,
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
            <Heading spacing size="small" level="5">
                Utgifter til skolepenger
            </Heading>
            <SkoleårsperioderSkolepenger
                skoleårsperioder={skoleårsPerioderState}
                låsteUtgiftIder={utgiftsIderForrigeBehandling}
                valideringsfeil={formState.errors.skoleårsperioder}
                settValideringsFeil={formState.setErrors}
                oppdaterHarUtførtBeregning={oppdaterHarUtførtBeregning}
            />
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
                    {visFeilmelding && (
                        <AdvarselTekst>
                            Kan ikke lagre vedtaket før beregning er utført
                        </AdvarselTekst>
                    )}
                </WrapperDobbelMarginTop>
            )}
            <WrapperDobbelMarginTop>
                <UtregningstabellSkolepenger
                    beregningsresultat={beregningsresultat}
                    skjulVisning={!harUtførtBeregning}
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
