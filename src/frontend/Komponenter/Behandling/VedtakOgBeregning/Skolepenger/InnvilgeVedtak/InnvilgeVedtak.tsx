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
import useFormState, {
    FormState,
    Valideringsfunksjon,
} from '../../../../../App/hooks/felles/useFormState';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { Alert, Heading } from '@navikt/ds-react';
import { useApp } from '../../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../../App/typer/ressurs';
import { UtregningstabellSkolepenger } from '../Felles/UtregnignstabellSkolepenger';
import {
    validerSkoleårsperioderMedBegrunnelse,
    validerSkoleårsperioderUtenBegrunnelse,
} from '../Felles/vedtaksvalidering';
import { BodyLongSmall, BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import { ARed500 } from '@navikt/ds-tokens/dist/tokens';
import { useRedirectEtterLagring } from '../../../../../App/hooks/felles/useRedirectEtterLagring';
import { v4 as uuidv4 } from 'uuid';
import { AlertError } from '../../../../../Felles/Visningskomponenter/Alerts';
import HovedKnapp, { Knapp } from '../../../../../Felles/Knapper/HovedKnapp';
import VisEllerEndreSkoleårsperioder from './VisEllerEndreSkoleårsperioder';
import { BegrunnelsesFelt } from '../Felles/BegrunnelsesFelt';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { CalculatorIcon } from '@navikt/aksel-icons';
import { InnvilgeVedtakForm } from '../Felles/typer';
import { ModalState } from '../../../Modal/NyEierModal';

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const AdvarselTekst = styled(BodyShortSmall)`
    color: ${ARed500};
`;

export const Utregningstabell = styled(UtregningstabellSkolepenger)`
    margin-left: 1rem;
`;

const InfoStripe = styled(Alert)`
    .navds-alert__wrapper {
        max-width: max-content;
    }
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const markerErHentetFraBackend = (
    skoleårsperioder: ISkoleårsperiodeSkolepenger[]
): ISkoleårsperiodeSkolepenger[] =>
    skoleårsperioder.map((periode) => ({ ...periode, erHentetFraBackend: true }));

const utledInitielleSkoleårsperioder = (
    forrigeVedtak?: IvedtakForSkolepenger
): ISkoleårsperiodeSkolepenger[] => {
    const forrigeSkoleårsperioder = forrigeVedtak?.skoleårsperioder;
    if (forrigeSkoleårsperioder && forrigeSkoleårsperioder.length > 0) {
        return markerErHentetFraBackend(forrigeSkoleårsperioder);
    } else {
        return [];
    }
};

export const InnvilgeVedtak: React.FC<{
    behandling: Behandling;
    lagretInnvilgetVedtak?: IvedtakForSkolepenger;
    forrigeVedtak?: IvedtakForSkolepenger;
}> = ({ behandling, lagretInnvilgetVedtak, forrigeVedtak }) => {
    const {
        behandlingErRedigerbar,
        hentAnsvarligSaksbehandler,
        hentBehandling,
        settNyEierModalState,
    } = useBehandling();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');
    const [harUtførtBeregning, settHarUtførtBeregning] = useState<boolean>(false);
    const [visFeilmelding, settVisFeilmelding] = useState<boolean>(false);

    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<IBeregningSkolepengerResponse>());
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const { utførRedirect } = useRedirectEtterLagring(`/behandling/${behandling.id}/simulering`);
    const formState = useFormState<InnvilgeVedtakForm>(
        {
            skoleårsperioder: lagretInnvilgetVedtak
                ? markerErHentetFraBackend(lagretInnvilgetVedtak.skoleårsperioder)
                : utledInitielleSkoleårsperioder(forrigeVedtak),
            begrunnelse: lagretInnvilgetVedtak?.begrunnelse || '',
        },
        validerSkoleårsperioderMedBegrunnelse
    );
    const skoleårsPerioderState = formState.getProps(
        'skoleårsperioder'
    ) as ListState<ISkoleårsperiodeSkolepenger>;
    const begrunnelseState = formState.getProps('begrunnelse') as FieldState;

    const utgiftIderForrigeBehandling = forrigeVedtak
        ? forrigeVedtak.skoleårsperioder.flatMap((p) => p.utgiftsperioder.map((u) => u.id))
        : [];

    useEffect(() => {
        if (!formState.isValid()) {
            formState.validateForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skoleårsPerioderState.value, begrunnelseState.value]);

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
                    settNyEierModalState(ModalState.LUKKET);
                    hentAnsvarligSaksbehandler.rerun();
            }
        };
    };

    const handleSubmit = (form: FormState<InnvilgeVedtakForm>) => {
        settVisFeilmelding(false);
        if (harUtførtBeregning) {
            const vedtaksRequest: IVedtakForSkolepenger = {
                skoleårsperioder: form.skoleårsperioder,
                begrunnelse: form.begrunnelse,
                _type: IVedtakType.InnvilgelseSkolepenger,
                resultatType: EBehandlingResultat.INNVILGE,
            };
            lagreVedtak(vedtaksRequest);
        } else {
            settVisFeilmelding(true);
        }
    };

    const beregnSkolepenger = () => {
        settHarUtførtBeregning(false);
        settVisFeilmelding(false);
        if (formState.customValidate(validerSkoleårsperioderUtenBegrunnelse)) {
            axiosRequest<IBeregningSkolepengerResponse, IBeregningsrequestSkolepenger>({
                method: 'POST',
                url: `/familie-ef-sak/api/beregning/skolepenger`,
                data: {
                    behandlingId: behandling.id,
                    skoleårsperioder: skoleårsPerioderState.value,
                    erOpphør: false,
                },
            }).then((res: Ressurs<IBeregningSkolepengerResponse>) => {
                settBeregningsresultat(res);
                settHarUtførtBeregning(true);
            });
        }
    };

    const customValidate = (fn: Valideringsfunksjon<InnvilgeVedtakForm>) =>
        formState.customValidate(fn);

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
            {behandlingErRedigerbar && <InfoStripeHvordanFatteVedtak />}
            <VisEllerEndreSkoleårsperioder
                customValidate={customValidate}
                låsteUtgiftIder={utgiftIderForrigeBehandling}
                oppdaterHarUtførtBeregning={settHarUtførtBeregning}
                settValideringsFeil={formState.setErrors}
                skoleårsperioder={skoleårsPerioderState}
                valideringsfeil={formState.errors.skoleårsperioder}
            />
            {feilmelding && <AlertError>{feilmelding}</AlertError>}
            {behandlingErRedigerbar && (
                <>
                    <div>
                        <hr />
                    </div>
                    <div>
                        <Knapp
                            variant={'secondary'}
                            onClick={beregnSkolepenger}
                            type={'button'}
                            icon={<CalculatorIcon title={'beregn'} />}
                            iconPosition={'right'}
                        >
                            Beregn
                        </Knapp>
                        {visFeilmelding && (
                            <AdvarselTekst>
                                Kan ikke lagre vedtaket før beregning er utført
                            </AdvarselTekst>
                        )}
                    </div>
                </>
            )}
            <Utregningstabell beregningsresultat={beregningsresultat} />
            {behandlingErRedigerbar && <HovedKnapp disabled={laster} knappetekst="Lagre vedtak" />}
        </Form>
    );
};

const InfoStripeHvordanFatteVedtak: React.FC = () => (
    <InfoStripe variant="info">
        <FlexColumn>
            <Heading size={'small'}>Hvordan legge inn utgifter til skolepenger</Heading>
            <BodyLongSmall>
                Du må legge til et nytt skoleår og fylle ut feltene med informasjon om utdanningen.
                Etter at du har lagt til det nye skoleåret, fyller du ut stønadsbeløpet. Hvis du
                skal innvilge stønad for nye utgifter for et skoleår som allerede er lagt inn,
                legger du til utgiften ved å klikke på «Legg til ny utgift for skoleåret xx/xx»
                under det aktuelle skoleåret.
            </BodyLongSmall>
            <BodyLongSmall>
                Hvis utdanningen bruker tar ikke følger det ordinære skoleåret, se
                opplæringsmateriell.
            </BodyLongSmall>
        </FlexColumn>
    </InfoStripe>
);
