import constate from 'constate';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IBehandlingParams } from '../typer/routing';
import { useRerunnableEffect } from '../hooks/felles/useRerunnableEffect';
import { useHentPersonopplysninger } from '../hooks/useHentPersonopplysninger';
import { useHentBehandling } from '../hooks/useHentBehandling';
import { useHentBehandlingHistorikk } from '../hooks/useHentBehandlingHistorikk';
import { useHentTotrinnskontroll } from '../hooks/useHentTotrinnStatus';
import { useHentRegler } from '../hooks/useHentRegler';
import { RessursStatus } from '../typer/ressurs';
import {
    BehandlingStatus,
    erBehandlingRedigerbar,
    innloggetSaksbehandlerKanRedigereBehandling,
    utredesEllerFatterVedtak,
} from '../typer/behandlingstatus';
import { useHentUtestengelser } from '../hooks/useHentUtestengelser';
import { useHentEndringerPersonopplysninger } from '../hooks/useHentEndringerPersonopplysninger';
import { useVilkår } from '../hooks/useVilkår';
import { useHentAnsvarligSaksbehandler } from '../hooks/useHentAnsvarligSaksbehandler';
import { useApp } from './AppContext';

const [BehandlingProvider, useBehandling] = constate(() => {
    const { innloggetSaksbehandler } = useApp();

    const behandlingId = useParams<IBehandlingParams>().behandlingId as string;

    const [behandlingErRedigerbar, settBehandlingErRedigerbar] = useState<boolean>(true);
    const { hentPersonopplysninger, personopplysningerResponse } =
        useHentPersonopplysninger(behandlingId);
    const { hentBehandlingCallback, behandling } = useHentBehandling(behandlingId);
    const { hentBehandlingshistorikkCallback, behandlingHistorikk } =
        useHentBehandlingHistorikk(behandlingId);
    const { hentTotrinnskontrollCallback, totrinnskontroll } =
        useHentTotrinnskontroll(behandlingId);
    const { hentAnsvarligSaksbehandlerCallback, ansvarligSaksbehandler } =
        useHentAnsvarligSaksbehandler(behandlingId);

    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);
    const hentAnsvarligSaksbehandler = useRerunnableEffect(hentAnsvarligSaksbehandlerCallback, [
        behandlingId,
    ]);
    const hentBehandlingshistorikk = useRerunnableEffect(hentBehandlingshistorikkCallback, [
        behandlingId,
    ]);

    const { hentUtestengelserForBehandling, utestengelser } = useHentUtestengelser();

    const { hentRegler, regler } = useHentRegler();

    const hentTotrinnskontroll = useRerunnableEffect(hentTotrinnskontrollCallback, [behandlingId]);

    const [visHenleggModal, settVisHenleggModal] = useState(false);
    const [visSettPåVent, settVisSettPåVent] = useState(false);
    const [åpenHøyremeny, settÅpenHøyremeny] = useState(true);

    const {
        endringerPersonopplysninger,
        nullstillGrunnlagsendringer,
        hentEndringerForPersonopplysninger,
    } = useHentEndringerPersonopplysninger();

    useEffect(() => {
        hentRegler();
        hentPersonopplysninger(behandlingId);
        hentUtestengelserForBehandling(behandlingId);
        // eslint-disable-next-line
    }, [behandlingId]);

    useEffect(() => {
        if (behandling.status === RessursStatus.SUKSESS) {
            if (
                utredesEllerFatterVedtak(behandling.data) &&
                endringerPersonopplysninger.status === RessursStatus.IKKE_HENTET
            ) {
                hentEndringerForPersonopplysninger(behandling.data.id);
            }
            settVisSettPåVent(behandling.data.status === BehandlingStatus.SATT_PÅ_VENT);
        }

        // eslint-disable-next-line
    }, [behandling]);

    useEffect(() => {
        settBehandlingErRedigerbar(
            behandling.status === RessursStatus.SUKSESS &&
                ansvarligSaksbehandler.status === RessursStatus.SUKSESS &&
                erBehandlingRedigerbar(behandling.data) &&
                innloggetSaksbehandlerKanRedigereBehandling(ansvarligSaksbehandler.data)
        );
    }, [behandling, ansvarligSaksbehandler, innloggetSaksbehandler]);

    const vilkårState = useVilkår();

    return {
        behandling,
        behandlingErRedigerbar,
        behandlingHistorikk,
        endringerPersonopplysninger,
        hentAnsvarligSaksbehandler,
        hentBehandling,
        hentBehandlingshistorikk,
        hentTotrinnskontroll,
        nullstillGrunnlagsendringer,
        personopplysningerResponse,
        regler,
        settVisHenleggModal,
        settVisSettPåVent,
        settÅpenHøyremeny,
        ansvarligSaksbehandler,
        totrinnskontroll,
        utestengelser,
        visHenleggModal,
        visSettPåVent,
        vilkårState,
        åpenHøyremeny,
    };
});

export { BehandlingProvider, useBehandling };
