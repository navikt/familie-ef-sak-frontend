import React, { FormEvent, useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { Ressurs, RessursStatus } from '../../../../typer/ressurs';
import { useHistory } from 'react-router-dom';
import { useBehandling } from '../../../../context/BehandlingContext';
import { EBehandlingResultat, IAvslåVedtak, IVedtak } from '../../../../typer/vedtak';
import { Behandling } from '../../../../typer/fagsak';
import AvslåVedtakForm from './AvslåVedtakForm';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import { Element, Normaltekst } from 'nav-frontend-typografi';

export const AvslåVedtak: React.FC<{ behandling: Behandling; lagretVedtak?: IVedtak }> = ({
    behandling,
    lagretVedtak,
}) => {
    const lagretAvslåBehandling =
        lagretVedtak?.resultatType === EBehandlingResultat.AVSLÅ
            ? (lagretVedtak as IAvslåVedtak)
            : undefined;
    const [avslåBegrunnelse, settAvslåBegrunnelse] = useState<string>(
        lagretAvslåBehandling?.avslåBegrunnelse ?? ''
    );
    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState<boolean>();
    const history = useHistory();
    const { hentBehandling, behandlingErRedigerbar } = useBehandling();
    const { axiosRequest } = useApp();

    const vedtakRequest: IAvslåVedtak = {
        resultatType: EBehandlingResultat.AVSLÅ,
        avslåBegrunnelse,
    };

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

    const lagBlankett = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        settLaster(true);
        axiosRequest<string, IAvslåVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandling.id}/lagre-vedtak`,
            data: vedtakRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/blankett`))
            .finally(() => {
                settLaster(false);
            });
    };

    return behandlingErRedigerbar ? (
        <AvslåVedtakForm
            avslåBegrunnelse={avslåBegrunnelse}
            settAvslåBegrunnelse={settAvslåBegrunnelse}
            laster={laster ?? false}
            lagBlankett={lagBlankett}
            feilmelding={feilmelding}
        />
    ) : (
        <FlexDiv>
            <Element style={{ marginRight: '0.25rem' }}>Begrunnelse for avslag:</Element>
            <Normaltekst children={avslåBegrunnelse} />
        </FlexDiv>
    );
};
