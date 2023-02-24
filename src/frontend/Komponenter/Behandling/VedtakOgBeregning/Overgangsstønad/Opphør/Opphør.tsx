import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import React, { FormEvent, useState } from 'react';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { useApp } from '../../../../../App/context/AppContext';
import {
    EBehandlingResultat,
    IOpphørtVedtak,
    IVedtakForOvergangsstønad,
    IVedtakType,
} from '../../../../../App/typer/vedtak';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../App/typer/ressurs';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { AlertError } from '../../../../../Felles/Visningskomponenter/Alerts';
import { Button } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

const Container = styled.div`
    margin-top: 1rem;
    padding: 1rem;
    background-color: ${AGray50};
`;

const HovedKnapp = styled(Button)`
    margin-top: 1rem;
`;

const TextArea = styled(EnsligTextArea)`
    margin-top: 1rem;
`;

export const Opphør: React.FC<{
    behandlingId: string;
    lagretVedtak?: IVedtakForOvergangsstønad;
}> = ({ behandlingId, lagretVedtak }) => {
    const [laster, settLaster] = useState(false);
    const lagretOpphørtVedtak =
        lagretVedtak?._type === IVedtakType.Opphør ? (lagretVedtak as IOpphørtVedtak) : undefined;
    const [opphørtFra, settOpphørtFra] = useState<string>(lagretOpphørtVedtak?.opphørFom || '');
    const [opphørtBegrunnelse, settOpphørtBegrunnelse] = useState<string>(
        lagretOpphørtVedtak?.begrunnelse || ''
    );
    const [feilmelding, settFeilmelding] = useState<string | undefined>();
    const { behandlingErRedigerbar, hentBehandling } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const navigate = useNavigate();

    const lagreVedtak = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (opphørtBegrunnelse && opphørtFra) {
            settLaster(true);
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
            navigate(`/behandling/${behandlingId}/simulering`);
            hentBehandling.rerun();
            nullstillIkkePersisterteKomponenter();
        } else {
            settFeilmelding(res.frontendFeilmelding);
        }
    };

    return (
        <>
            <form onSubmit={lagreVedtak}>
                <Container>
                    <MånedÅrVelger
                        label={'Opphør fra og med'}
                        onEndret={(årMåned) => {
                            settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                            årMåned && settOpphørtFra(årMåned);
                        }}
                        antallÅrTilbake={3}
                        antallÅrFrem={3}
                        disabled={!behandlingErRedigerbar}
                        årMånedInitiell={opphørtFra}
                    />
                    <TextArea
                        label={'Begrunnelse for opphør'}
                        maxLength={0}
                        erLesevisning={!behandlingErRedigerbar}
                        value={opphørtBegrunnelse}
                        onChange={(begrunnelse) => {
                            settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                            settOpphørtBegrunnelse(begrunnelse.target.value);
                        }}
                    />
                </Container>
                {behandlingErRedigerbar && (
                    <HovedKnapp type="submit" disabled={laster}>
                        Lagre vedtak
                    </HovedKnapp>
                )}
            </form>
            {feilmelding && <AlertError>{feilmelding}</AlertError>}
        </>
    );
};
