import constate from 'constate';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { IBehandlingParams } from '../typer/routing';
import { useRerunnableEffect } from '../hooks/felles/useRerunnableEffect';
import { useHentPersonopplysninger } from '../hooks/useHentPersonopplysninger';
import { useHentBehandling } from '../hooks/useHentBehandling';
import { useHentBehandlingHistorikk } from '../hooks/useHentBehandlingHistorikk';
import { useHentTotrinnskontroll } from '../hooks/useHentTotrinnStatus';

const [BehandlingProvider, useBehandling] = constate(() => {
    const { behandlingId } = useParams<IBehandlingParams>();
    const { hentPersonopplysninger, personopplysningerResponse } = useHentPersonopplysninger(
        behandlingId
    );
    const { hentBehandlingCallback, behandling } = useHentBehandling(behandlingId);
    const { hentBehandlingshistorikkCallback, behandlingHistorikk } = useHentBehandlingHistorikk(
        behandlingId
    );
    const { hentTotrinnskontrollCallback, totrinnskontroll } = useHentTotrinnskontroll(
        behandlingId
    );

    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);
    const hentBehandlingshistorikk = useRerunnableEffect(hentBehandlingshistorikkCallback, [
        behandlingId,
    ]);

    const hentTotrinnskontroll = useRerunnableEffect(hentTotrinnskontrollCallback, [behandlingId]);

    useEffect(() => hentPersonopplysninger(behandlingId), [behandlingId]);

    return {
        behandling,
        totrinnskontroll,
        personopplysningerResponse,
        behandlingHistorikk,
        hentBehandling,
        hentTotrinnskontroll,
        hentBehandlingshistorikk,
    };
});

export { BehandlingProvider, useBehandling };
