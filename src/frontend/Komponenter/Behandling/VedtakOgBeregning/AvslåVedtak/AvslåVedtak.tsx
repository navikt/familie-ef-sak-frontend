import React, { FormEvent, useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../../App/typer/ressurs';
import { useHistory } from 'react-router-dom';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { EBehandlingResultat, IAvslåVedtak, IVedtak } from '../../../../App/typer/vedtak';
import { Behandling } from '../../../../App/typer/fagsak';
import AvslåVedtakForm from './AvslåVedtakForm';
import { Behandlingstype } from '../../../../App/typer/behandlingstype';

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
    const { axiosRequest, nullstillIkkePersisterteKomponenter } = useApp();

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

    const avslåBlankett = () => {
        settLaster(true);
        axiosRequest<string, IAvslåVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandling.id}/lagre-blankettvedtak`,
            data: vedtakRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/blankett`))
            .finally(() => {
                settLaster(false);
            });
    };

    const avslåBehandling = () => {
        settLaster(true);
        axiosRequest<string, IAvslåVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandling.id}/fullfor`,
            data: vedtakRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/brev`))
            .finally(() => {
                settLaster(false);
            });
    };

    const lagreVedtak = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        switch (behandling.type) {
            case Behandlingstype.BLANKETT:
                avslåBlankett();
                break;
            case Behandlingstype.FØRSTEGANGSBEHANDLING:
            case Behandlingstype.REVURDERING:
                avslåBehandling();
                break;
        }
    };

    return (
        <AvslåVedtakForm
            avslåBegrunnelse={avslåBegrunnelse}
            settAvslåBegrunnelse={settAvslåBegrunnelse}
            laster={laster ?? false}
            lagreVedtak={lagreVedtak}
            feilmelding={feilmelding}
            behandlingErRedigerbar={behandlingErRedigerbar}
        />
    );
};
