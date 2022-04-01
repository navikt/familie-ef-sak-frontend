import React, { FormEvent, useEffect, useState } from 'react';
import { useApp } from '../../../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../../../App/typer/ressurs';
import { useNavigate } from 'react-router-dom';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import {
    EAvslagÅrsak,
    EBehandlingResultat,
    IAvslåVedtakForOvergangsstønad,
    IVedtakForOvergangsstønad,
} from '../../../../../App/typer/vedtak';
import { Behandling } from '../../../../../App/typer/fagsak';
import AvslåVedtakForm from './AvslåVedtakForm';
import { Behandlingstype } from '../../../../../App/typer/behandlingstype';

export const AvslåVedtak: React.FC<{
    behandling: Behandling;
    lagretVedtak?: IVedtakForOvergangsstønad;
    alleVilkårOppfylt: boolean;
    ikkeOppfyltVilkårEksisterer: boolean;
}> = ({ behandling, lagretVedtak, alleVilkårOppfylt, ikkeOppfyltVilkårEksisterer }) => {
    const lagretAvslåBehandling =
        lagretVedtak?.resultatType === EBehandlingResultat.AVSLÅ
            ? (lagretVedtak as IAvslåVedtakForOvergangsstønad)
            : undefined;
    const [avslagBegrunnelse, settAvslagBegrunnelse] = useState<string>(
        lagretAvslåBehandling?.avslåBegrunnelse ?? ''
    );
    const [avslagÅrsak, settAvslagÅrsak] = useState<EAvslagÅrsak>(
        lagretAvslåBehandling?.avslåÅrsak ?? EAvslagÅrsak.VILKÅR_IKKE_OPPFYLT
    );
    const [feilmelding, settFeilmelding] = useState<string>();
    const [feilmeldingÅrsak, settFeilmeldingÅrsak] = useState<string>('');
    const [årsaksmenyVises, settÅrsaksmenyVises] = useState<boolean>(
        alleVilkårOppfylt || !ikkeOppfyltVilkårEksisterer
    );
    const [ugyldigAvslagÅrsak, settUgyldigAvslagÅrsak] = useState<boolean>(
        !avslagÅrsak || avslagÅrsak === EAvslagÅrsak.VILKÅR_IKKE_OPPFYLT
    );
    const [laster, settLaster] = useState<boolean>();
    const navigate = useNavigate();
    const { hentBehandling, behandlingErRedigerbar } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter } = useApp();

    const vedtakRequest: IAvslåVedtakForOvergangsstønad = {
        resultatType: EBehandlingResultat.AVSLÅ,
        avslåÅrsak: avslagÅrsak,
        avslåBegrunnelse: avslagBegrunnelse,
    };

    useEffect(() => {
        settÅrsaksmenyVises(alleVilkårOppfylt || !ikkeOppfyltVilkårEksisterer);
        settUgyldigAvslagÅrsak(!avslagÅrsak || avslagÅrsak === EAvslagÅrsak.VILKÅR_IKKE_OPPFYLT);
    }, [alleVilkårOppfylt, ikkeOppfyltVilkårEksisterer, avslagÅrsak]);

    const håndterVedtaksresultat = (nesteUrl: string) => {
        return (res: Ressurs<string>) => {
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    navigate(nesteUrl);
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
        axiosRequest<string, IAvslåVedtakForOvergangsstønad>({
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
        axiosRequest<string, IAvslåVedtakForOvergangsstønad>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandling.id}/lagre-vedtak`,
            data: vedtakRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandling.id}/brev`))
            .finally(() => {
                settLaster(false);
            });
    };

    const lagreVedtak = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        settFeilmeldingÅrsak('');
        if (årsaksmenyVises && ugyldigAvslagÅrsak) {
            settFeilmeldingÅrsak('Manglende årsak');
            return;
        }

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
            avslagÅrsak={avslagÅrsak}
            settAvslagÅrsak={settAvslagÅrsak}
            avslagBegrunnelse={avslagBegrunnelse}
            settAvslagBegrunnelse={settAvslagBegrunnelse}
            laster={laster ?? false}
            lagreVedtak={lagreVedtak}
            feilmelding={feilmelding}
            behandlingErRedigerbar={behandlingErRedigerbar}
            alleVilkårOppfylt={alleVilkårOppfylt}
            ikkeOppfyltVilkårEksisterer={ikkeOppfyltVilkårEksisterer}
            feilmeldingÅrsak={feilmeldingÅrsak}
        />
    );
};
