import React, { FormEvent, useState } from 'react';
import { useApp } from '../../../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../../../App/typer/ressurs';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import {
    EAvslagÅrsak,
    EBehandlingResultat,
    IAvslagVedtak,
    IVedtakType,
} from '../../../../../App/typer/vedtak';
import { Behandling } from '../../../../../App/typer/fagsak';
import AvslåVedtakForm from './AvslåVedtakForm';
import { Behandlingstype } from '../../../../../App/typer/behandlingstype';
import { Stønadstype } from '../../../../../App/typer/behandlingstema';
import { useRedirectEtterLagring } from '../../../../../App/hooks/felles/useRedirectEtterLagring';
import { v4 as uuidv4 } from 'uuid';

export const AvslåVedtak: React.FC<{
    behandling: Behandling;
    lagretVedtak?: IAvslagVedtak;
    alleVilkårOppfylt: boolean;
    ikkeOppfyltVilkårEksisterer: boolean;
}> = ({ behandling, lagretVedtak, alleVilkårOppfylt, ikkeOppfyltVilkårEksisterer }) => {
    const { utførRedirect } = useRedirectEtterLagring(`/behandling/${behandling.id}/brev`);
    const lagretAvslåBehandling =
        lagretVedtak?._type === IVedtakType.Avslag ? (lagretVedtak as IAvslagVedtak) : undefined;
    const [avslagBegrunnelse, settAvslagBegrunnelse] = useState<string>(
        lagretAvslåBehandling?.avslåBegrunnelse ?? ''
    );
    const [avslagÅrsak, settAvslagÅrsak] = useState<EAvslagÅrsak>(
        lagretAvslåBehandling?.avslåÅrsak ?? EAvslagÅrsak.VILKÅR_IKKE_OPPFYLT
    );
    const [feilmelding, settFeilmelding] = useState<string>();
    const [feilmeldingÅrsak, settFeilmeldingÅrsak] = useState<string>('');

    const erUgyldigAvslagÅrsak = () =>
        skalVelgeÅrsak && (!avslagÅrsak || avslagÅrsak === EAvslagÅrsak.VILKÅR_IKKE_OPPFYLT);

    const [laster, settLaster] = useState<boolean>();
    const { hentBehandling, behandlingErRedigerbar } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    const lagVedtakRequest = (): IAvslagVedtak => ({
        resultatType: EBehandlingResultat.AVSLÅ,
        avslåÅrsak: avslagÅrsak,
        avslåBegrunnelse: avslagBegrunnelse,
        _type: IVedtakType.Avslag,
    });

    const erOvergangsstønad = behandling.stønadstype === Stønadstype.OVERGANGSSTØNAD;
    const skalVelgeÅrsak = erOvergangsstønad && alleVilkårOppfylt && !ikkeOppfyltVilkårEksisterer;

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

    const avslåBehandling = () => {
        settLaster(true);
        nullstillIkkePersisterteKomponenter();
        axiosRequest<string, IAvslagVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandling.id}/lagre-vedtak`,
            data: lagVedtakRequest(),
        })
            .then(håndterVedtaksresultat())
            .finally(() => {
                settLaster(false);
            });
    };

    const lagreVedtak = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        settFeilmeldingÅrsak('');
        if (erUgyldigAvslagÅrsak()) {
            settFeilmeldingÅrsak('Manglende årsak');
            return;
        }

        switch (behandling.type) {
            case Behandlingstype.FØRSTEGANGSBEHANDLING:
            case Behandlingstype.REVURDERING:
                avslåBehandling();
                break;
        }
    };

    return (
        <AvslåVedtakForm
            avslagÅrsak={avslagÅrsak}
            settAvslagÅrsak={settAvslagÅrsak}
            avslagBegrunnelse={avslagBegrunnelse}
            settAvslagBegrunnelse={settAvslagBegrunnelse}
            laster={laster ?? false}
            lagreVedtak={lagreVedtak}
            feilmelding={feilmelding}
            behandlingErRedigerbar={behandlingErRedigerbar}
            feilmeldingÅrsak={feilmeldingÅrsak}
            skalVelgeÅrsak={skalVelgeÅrsak}
        />
    );
};
