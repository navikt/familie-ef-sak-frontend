import MånedÅrVelger from '../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import React, { FormEvent, useState } from 'react';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../../../../App/context/AppContext';
import { EBehandlingResultat, IOpphørtVedtak, IVedtak } from '../../../../App/typer/vedtak';
import { Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import { useHistory } from 'react-router-dom';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import styled from 'styled-components';
import { EnsligTextArea } from '../../../../Felles/Input/TekstInput/EnsligTextArea';

const StyledFormElement = styled.div`
    margin-bottom: 2rem;
`;

export const Opphør: React.FC<{ behandlingId: string; lagretVedtak?: IVedtak }> = ({
    behandlingId,
    lagretVedtak,
}) => {
    const [laster, settLaster] = useState(false);
    const lagretOpphørtVedtak =
        lagretVedtak?.resultatType === EBehandlingResultat.OPPHØRT
            ? (lagretVedtak as IOpphørtVedtak)
            : undefined;
    const [opphørtFra, settOpphørtFra] = useState<string>(lagretOpphørtVedtak?.opphørFom || '');
    const [opphørtBegrunnelse, settOpphørtBegrunnelse] = useState<string>(
        lagretOpphørtVedtak?.begrunnelse || ''
    );
    const [feilmelding, settFeilmelding] = useState<string | undefined>();
    const { behandlingErRedigerbar, hentBehandling, nullstillIkkePersisterteKomponenter } =
        useBehandling();
    const { axiosRequest } = useApp();
    const history = useHistory();

    const lagreVedtak = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (opphørtBegrunnelse && opphørtFra) {
            settLaster(true);
            axiosRequest<string, IOpphørtVedtak>({
                method: 'POST',
                url: `/familie-ef-sak/api/beregning/${behandlingId}/fullfor`,
                data: {
                    resultatType: EBehandlingResultat.OPPHØRT,
                    opphørFom: opphørtFra,
                    begrunnelse: opphørtBegrunnelse,
                } as IOpphørtVedtak,
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
                history.push(`/behandling/${behandlingId}/simulering`);
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
                        onEndret={(årMåned) => årMåned && settOpphørtFra(årMåned)}
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
                        onChange={(begrunnelse) => settOpphørtBegrunnelse(begrunnelse.target.value)}
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
