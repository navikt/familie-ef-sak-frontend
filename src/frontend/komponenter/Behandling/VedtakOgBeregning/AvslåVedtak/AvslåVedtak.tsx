import { Textarea } from 'nav-frontend-skjema';
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { Ressurs, RessursStatus } from '../../../../typer/ressurs';
import { useHistory } from 'react-router-dom';
import { useBehandling } from '../../../../context/BehandlingContext';
import { EBehandlingResultat } from '../../../../typer/vedtak';
import { Behandling } from '../../../../typer/fagsak';
import { Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

export const AvslåVedtak: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const [periodeBegrunnelse, settPeriodeBegrunnelse] = useState<string>('');
    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState<boolean>();
    const history = useHistory();
    const { hentBehandling } = useBehandling();
    const { axiosRequest } = useApp();

    const håndterVedtaksresultat = (nesteUrl: string) => {
        return (res: Ressurs<string>) => {
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    history.push(nesteUrl);
                    hentBehandling.rerun();
                    break;
                case RessursStatus.HENTER:
                case RessursStatus.IKKE_HENTET:
                    break;
                default:
                    settFeilmelding(res.frontendFeilmelding);
            }
        };
    };

    const lagBlankett = () => {
        settLaster(true);
        axiosRequest<string, { periodeBegrunnelse: string; resultatType: EBehandlingResultat }>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandling.id}/lagre-vedtak`,
            data: {
                periodeBegrunnelse,
                resultatType: EBehandlingResultat.AVSLÅ,
            },
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/blankett`))
            .finally(() => {
                settLaster(false);
            });
    };

    return (
        <>
            <form style={{ marginTop: '2rem' }} onSubmit={lagBlankett}>
                <Textarea
                    value={periodeBegrunnelse}
                    onChange={(e) => {
                        settPeriodeBegrunnelse(e.target.value);
                    }}
                    label="Begrunnelse"
                    maxLength={0}
                />
                <Hovedknapp htmlType="submit" disabled={laster}>
                    Lagre vedtak
                </Hovedknapp>
            </form>
            {feilmelding && (
                <AlertStripeFeil style={{ marginTop: '2rem' }}>{feilmelding}</AlertStripeFeil>
            )}
        </>
    );
};
