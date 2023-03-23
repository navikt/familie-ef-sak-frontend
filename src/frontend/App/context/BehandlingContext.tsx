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
import { erBehandlingRedigerbar, utredesEllerFatterVedtak } from '../typer/behandlingstatus';
import { useApp } from './AppContext';
import { useHentUtestengelser } from '../hooks/useHentUtestengelser';
import { useHentEndringerPersonopplysninger } from '../hooks/useHentEndringerPersonopplysninger';
import { useVilkår } from '../hooks/useVilkår';

const [BehandlingProvider, useBehandling] = constate(() => {
    const { axiosRequest } = useApp();
    const behandlingId = useParams<IBehandlingParams>().behandlingId as string;

    const [behandlingErRedigerbar, settBehandlingErRedigerbar] = useState<boolean>(true);
    const { hentPersonopplysninger, personopplysningerResponse } =
        useHentPersonopplysninger(behandlingId);
    const { hentBehandlingCallback, behandling } = useHentBehandling(behandlingId);
    const { hentBehandlingshistorikkCallback, behandlingHistorikk } =
        useHentBehandlingHistorikk(behandlingId);
    const { hentTotrinnskontrollCallback, totrinnskontroll } =
        useHentTotrinnskontroll(behandlingId);

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
    useEffect(
        () =>
            settBehandlingErRedigerbar(
                behandling.status === RessursStatus.SUKSESS &&
                    erBehandlingRedigerbar(behandling.data)
            ),
        [behandling]
    );
    useEffect(() => {
        if (behandlingErRedigerbar) {
            axiosRequest<string | null, string>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgave/${behandlingId}/tilordnet-ressurs`,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        // eslint-disable-next-line
    }, [behandling]);

    const vilkårState = useVilkår();

    return {
        behandling,
        behandlingErRedigerbar,
        totrinnskontroll,
        personopplysningerResponse,
        behandlingHistorikk,
        hentBehandling,
        hentTotrinnskontroll,
        hentBehandlingshistorikk,
        regler,
        visHenleggModal,
        settVisHenleggModal,
        visSettPåVent,
        settVisSettPåVent,
        åpenHøyremeny,
        settÅpenHøyremeny,
        utestengelser,
        endringerPersonopplysninger,
        nullstillGrunnlagsendringer,
        vilkårState,
    };
});

export { BehandlingProvider, useBehandling };
