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
import { useToggles } from './TogglesContext';
import { useHentAnsvarligSaksbehandler } from '../hooks/useHentAnsvarligSaksbehandler';
import { useApp } from './AppContext';

const [BehandlingProvider, useBehandling] = constate(() => {
    const { toggles } = useToggles();
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
    const { hentAnsvarligSaksbehandler, ansvarligSaksbehandler } =
        useHentAnsvarligSaksbehandler(behandlingId);

    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);
    const hentBehandlingshistorikk = useRerunnableEffect(hentBehandlingshistorikkCallback, [
        behandlingId,
    ]);

    const { hentUtestengelserForBehandling, utestengelser } = useHentUtestengelser();
    useEffect(() => {
        hentUtestengelserForBehandling(behandlingId);
    }, [hentUtestengelserForBehandling, behandlingId]);

    const { hentRegler, regler } = useHentRegler();
    // eslint-disable-next-line
    useEffect(() => hentRegler(), [behandlingId]);

    const hentTotrinnskontroll = useRerunnableEffect(hentTotrinnskontrollCallback, [behandlingId]);
    // eslint-disable-next-line
    useEffect(() => hentPersonopplysninger(behandlingId), [behandlingId]);
    useEffect(() => {
        settBehandlingErRedigerbar(
            behandling.status === RessursStatus.SUKSESS &&
                ansvarligSaksbehandler.status === RessursStatus.SUKSESS &&
                erBehandlingRedigerbar(behandling.data) &&
                innloggetSaksbehandlerKanRedigereBehandling(
                    ansvarligSaksbehandler.data,
                    innloggetSaksbehandler
                )
        );
        settVisSettPåVent(
            behandling.status === RessursStatus.SUKSESS &&
                behandling.data.status === BehandlingStatus.SATT_PÅ_VENT
        );
    }, [behandling, toggles, ansvarligSaksbehandler, innloggetSaksbehandler]);

    const [visHenleggModal, settVisHenleggModal] = useState(false);
    const [visSettPåVent, settVisSettPåVent] = useState(false);
    const [åpenHøyremeny, settÅpenHøyremeny] = useState(true);

    const {
        endringerPersonopplysninger,
        nullstillGrunnlagsendringer,
        hentEndringerForPersonopplysninger,
    } = useHentEndringerPersonopplysninger();

    useEffect(() => {
        if (
            behandling.status === RessursStatus.SUKSESS &&
            utredesEllerFatterVedtak(behandling.data) &&
            endringerPersonopplysninger.status === RessursStatus.IKKE_HENTET
        ) {
            hentEndringerForPersonopplysninger(behandling.data.id);
        }
        hentAnsvarligSaksbehandler();
        // eslint-disable-next-line
    }, [behandling]);

    const vilkårState = useVilkår();

    return {
        behandling,
        behandlingErRedigerbar,
        behandlingHistorikk,
        endringerPersonopplysninger,
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
