import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import React, { FormEvent, useState } from 'react';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../../../../../App/context/AppContext';
import {
    EBehandlingResultat,
    IOpphørtVedtakForOvergangsstønad,
    IVedtakForOvergangsstønad,
    IVedtakType,
} from '../../../../../App/typer/vedtak';
import { Ressurs, RessursStatus } from '../../../../../App/typer/ressurs';
import { useNavigate } from 'react-router-dom';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import styled from 'styled-components';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';

const StyledFormElement = styled.div`
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

export const Opphør: React.FC<{
    behandlingId: string;
    lagretVedtak?: IVedtakForOvergangsstønad;
}> = ({ behandlingId, lagretVedtak }) => {
    const [laster, settLaster] = useState(false);
    const lagretOpphørtVedtak =
        lagretVedtak?._type === IVedtakType.OpphørOvergangsstønad
            ? (lagretVedtak as IOpphørtVedtakForOvergangsstønad)
            : undefined;
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
            const opphør: IOpphørtVedtakForOvergangsstønad = {
                resultatType: EBehandlingResultat.OPPHØRT,
                opphørFom: opphørtFra,
                begrunnelse: opphørtBegrunnelse,
                _type: IVedtakType.OpphørOvergangsstønad,
            };
            axiosRequest<string, IOpphørtVedtakForOvergangsstønad>({
                method: 'POST',
                url: `/familie-ef-sak/api/beregning/${behandlingId}/fullfor`,
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

    const håndterOpphørtVedtak = (res: Ressurs<string>) => {
        switch (res.status) {
            case RessursStatus.SUKSESS:
                navigate(`/behandling/${behandlingId}/simulering`);
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

    return (
        <>
            <form onSubmit={lagreVedtak}>
                <StyledFormElement>
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
                </StyledFormElement>
                <StyledFormElement>
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
                </StyledFormElement>
                <StyledFormElement>
                    <Hovedknapp
                        htmlType={'submit'}
                        disabled={laster}
                        hidden={!behandlingErRedigerbar}
                    >
                        Lagre vedtak
                    </Hovedknapp>
                </StyledFormElement>
            </form>
            {feilmelding && <AlertStripeFeil>{feilmelding}</AlertStripeFeil>}
        </>
    );
};
