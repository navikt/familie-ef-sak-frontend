import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import React, { FormEvent, useState } from 'react';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { useApp } from '../../../../../App/context/AppContext';
import { EBehandlingResultat, IOpphørtVedtak, IVedtakType } from '../../../../../App/typer/vedtak';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../App/typer/ressurs';
import styled from 'styled-components';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../konstanter';
import { AlertError } from '../../../../../Felles/Visningskomponenter/Alerts';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { useRedirectEtterLagring } from '../../../../../App/hooks/felles/useRedirectEtterLagring';
import { v4 as uuidv4 } from 'uuid';
import HovedKnapp from '../../../../../Felles/Knapper/HovedKnapp';

const Form = styled.form`
    padding: 1rem;
    background-color: ${AGray50};
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const OpphøreVedtak: React.FC<{
    behandlingId: string;
    lagretVedtak?: IOpphørtVedtak;
}> = ({ behandlingId, lagretVedtak }) => {
    const { utførRedirect } = useRedirectEtterLagring(`/behandling/${behandlingId}/simulering`);
    const [laster, settLaster] = useState(false);
    const lagretOpphørtVedtak =
        lagretVedtak?._type === IVedtakType.Opphør ? (lagretVedtak as IOpphørtVedtak) : undefined;
    const [opphørtFra, settOpphørtFra] = useState<string>(lagretOpphørtVedtak?.opphørFom || '');
    const [opphørtBegrunnelse, settOpphørtBegrunnelse] = useState<string>(
        lagretOpphørtVedtak?.begrunnelse || ''
    );
    const [feilmelding, settFeilmelding] = useState<string | undefined>();
    const { behandlingErRedigerbar, hentAnsvarligSaksbehandler, hentBehandling } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    const lagreVedtak = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (opphørtBegrunnelse && opphørtFra) {
            settLaster(true);
            nullstillIkkePersisterteKomponenter();
            const opphør: IOpphørtVedtak = {
                resultatType: EBehandlingResultat.OPPHØRT,
                opphørFom: opphørtFra,
                begrunnelse: opphørtBegrunnelse,
                _type: IVedtakType.Opphør,
            };
            axiosRequest<string, IOpphørtVedtak>({
                method: 'POST',
                url: `/familie-ef-sak/api/vedtak/${behandlingId}/lagre-vedtak`,
                data: opphør,
            })
                .then(håndterOpphørtVedtak)
                .finally(() => {
                    settLaster(false);
                });
        } else {
            settFeilmelding('Dato eller begrunnelse mangler');
        }
    };

    const håndterOpphørtVedtak = (res: RessursSuksess<string> | RessursFeilet) => {
        if (res.status === RessursStatus.SUKSESS) {
            hentBehandling.rerun();
            utførRedirect();
        } else {
            settIkkePersistertKomponent(uuidv4());
            settFeilmelding(res.frontendFeilmelding);
            hentAnsvarligSaksbehandler.rerun();
        }
    };

    return (
        <Form onSubmit={lagreVedtak}>
            <MånedÅrVelger
                label={'Opphør fra og med'}
                onEndret={(årMåned) => {
                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                    årMåned && settOpphørtFra(årMåned);
                }}
                antallÅrTilbake={6}
                antallÅrFrem={3}
                disabled={!behandlingErRedigerbar}
                årMånedInitiell={opphørtFra}
            />
            <EnsligTextArea
                label={'Begrunnelse for opphør'}
                maxLength={0}
                erLesevisning={!behandlingErRedigerbar}
                value={opphørtBegrunnelse}
                onChange={(begrunnelse) => {
                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                    settOpphørtBegrunnelse(begrunnelse.target.value);
                }}
            />
            {feilmelding && <AlertError>{feilmelding}</AlertError>}
            {behandlingErRedigerbar && <HovedKnapp disabled={laster} knappetekst="Lagre vedtak" />}
        </Form>
    );
};
