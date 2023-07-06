import {
    EBehandlingResultat,
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
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { useApp } from '../../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../../App/typer/ressurs';
import { UtregningstabellSkolepenger } from '../UtregnignstabellSkolepenger';
import { validerInnvilgetVedtakForm, validerSkoleårsperioder } from './vedtaksvalideringDeprecated';
import { tomSkoleårsperiodeSkolepenger } from '../typer';
import SkoleårsperioderSkolepenger from './SkoleårsperioderSkolepenger';
import OpphørSkolepenger from '../OpphørSkolepenger/OpphørSkolepenger';
import { BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import { ARed500 } from '@navikt/ds-tokens/dist/tokens';
import { useRedirectEtterLagring } from '../../../../../App/hooks/felles/useRedirectEtterLagring';
import { v4 as uuidv4 } from 'uuid';
import { BegrunnelsesFelt } from './BegrunnelsesFelt';
import { AlertError } from '../../../../../Felles/Visningskomponenter/Alerts';
import HovedKnapp from '../../../../../Felles/Knapper/HovedKnapp';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const AdvarselTekst = styled(BodyShortSmall)`
    color: ${ARed500};
`;

const Utregningstabell = styled(UtregningstabellSkolepenger)`
    margin-left: 1rem;
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
                resultatType: erOpphør ? EBehandlingResultat.OPPHØRT : EBehandlingResultat.INNVILGE,
            };
            lagreVedtak(vedtaksRequest);
        } else {
            settVisFeilmelding(true);
        }
    };

    const beregnSkolepenger = () => {
        settHarUtførtBeregning(false);
        settVisFeilmelding(false);
        if (formState.customValidate(validerSkoleårsperioder)) {
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
        <Form onSubmit={formState.onSubmit(handleSubmit)}>
            <BegrunnelsesFelt begrunnelseState={begrunnelseState} errorState={formState.errors} />
            {erOpphør ? (
                <OpphørSkolepenger
                    skoleårsperioder={skoleårsPerioderState}
                    forrigeSkoleårsperioder={forrigeVedtak?.skoleårsperioder || []}
                    valideringsfeil={formState.errors.skoleårsperioder}
                    settValideringsFeil={formState.setErrors}
                />
            ) : (
                <SkoleårsperioderSkolepenger
                    skoleårsperioder={skoleårsPerioderState}
                    låsteUtgiftIder={utgiftsIderForrigeBehandling}
                    valideringsfeil={formState.errors.skoleårsperioder}
                    settValideringsFeil={formState.setErrors}
                    oppdaterHarUtførtBeregning={settHarUtførtBeregning}
                />
            )}
            {feilmelding && <AlertError>{feilmelding}</AlertError>}
            {behandlingErRedigerbar && !erOpphør && (
                <div>
                    <Button variant={'secondary'} onClick={beregnSkolepenger} type={'button'}>
                        Beregn
                    </Button>
                    {visFeilmelding && (
                        <AdvarselTekst>
                            Kan ikke lagre vedtaket før beregning er utført
                        </AdvarselTekst>
                    )}
                </div>
            )}
            <Utregningstabell beregningsresultat={beregningsresultat} />
            {behandlingErRedigerbar && <HovedKnapp disabled={laster} knappetekst="Lagre vedtak" />}
        </Form>
    );
};
