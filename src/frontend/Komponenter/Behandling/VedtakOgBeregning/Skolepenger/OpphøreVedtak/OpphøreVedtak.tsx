import {
    EBehandlingResultat,
    IBeregningSkolepengerResponse,
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
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { useApp } from '../../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../../App/typer/ressurs';
import { InnvilgeVedtakForm, tomSkoleårsperiodeSkolepenger } from '../Felles/typer';
import OpphøreSkolepenger from './OpphøreSkolepenger';
import { useRedirectEtterLagring } from '../../../../../App/hooks/felles/useRedirectEtterLagring';
import { v4 as uuidv4 } from 'uuid';
import { BegrunnelsesFelt } from '../Felles/BegrunnelsesFelt';
import { AlertError } from '../../../../../Felles/Visningskomponenter/Alerts';
import HovedKnapp from '../../../../../Felles/Knapper/HovedKnapp';
import { validerSkoleårsperioderForOpphør } from '../Felles/vedtaksvalidering';
import { Form, Utregningstabell } from '../InnvilgeVedtak/InnvilgeVedtak';
import { ModalState } from '../../../Modal/NyEierModal';

const utledInitielleSkoleårsperioder = (
    forrigeVedtak?: IvedtakForSkolepenger
): ISkoleårsperiodeSkolepenger[] => {
    const forrigeSkoleårsperioder = forrigeVedtak?.skoleårsperioder;
    if (forrigeSkoleårsperioder && forrigeSkoleårsperioder.length > 0) {
        return forrigeSkoleårsperioder;
    } else {
        return [tomSkoleårsperiodeSkolepenger()];
    }
};

export const OpphøreVedtak: React.FC<{
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
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const { utførRedirect } = useRedirectEtterLagring(`/behandling/${behandling.id}/simulering`);

    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState('');
    const [beregningsresultat, settBeregningsresultat] = useState(
        byggTomRessurs<IBeregningSkolepengerResponse>()
    );

    const formState = useFormState<InnvilgeVedtakForm>(
        {
            skoleårsperioder: lagretInnvilgetVedtak
                ? lagretInnvilgetVedtak.skoleårsperioder
                : utledInitielleSkoleårsperioder(forrigeVedtak),
            begrunnelse: lagretInnvilgetVedtak?.begrunnelse || '',
        },
        validerSkoleårsperioderForOpphør
    );

    const skoleårsPerioderState = formState.getProps(
        'skoleårsperioder'
    ) as ListState<ISkoleårsperiodeSkolepenger>;

    const begrunnelseState = formState.getProps('begrunnelse') as FieldState;

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
        const vedtaksRequest: IVedtakForSkolepenger = {
            skoleårsperioder: form.skoleårsperioder,
            begrunnelse: form.begrunnelse,
            _type: IVedtakType.OpphørSkolepenger,
            resultatType: EBehandlingResultat.OPPHØRT,
        };
        lagreVedtak(vedtaksRequest);
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
            <OpphøreSkolepenger
                skoleårsperioder={skoleårsPerioderState}
                skoleårsperioderForrigeVedtak={forrigeVedtak?.skoleårsperioder || []}
                valideringsfeil={formState.errors.skoleårsperioder}
                settValideringsFeil={formState.setErrors}
            />
            {feilmelding && <AlertError>{feilmelding}</AlertError>}
            <Utregningstabell beregningsresultat={beregningsresultat} />
            {behandlingErRedigerbar && <HovedKnapp disabled={laster} knappetekst="Lagre vedtak" />}
        </Form>
    );
};
