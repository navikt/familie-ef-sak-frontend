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
import { erBehandlingRedigerbar } from '../typer/behandlingstatus';
import { useHentNavKontor } from '../hooks/useHentNavKontor';

const [BehandlingProvider, useBehandling] = constate(() => {
    const { behandlingId } = useParams<IBehandlingParams>();
    const [behandlingErRedigerbar, settBehandlingErRedigerbar] = useState<boolean>(true);
    const { hentPersonopplysninger, personopplysningerResponse } =
        useHentPersonopplysninger(behandlingId);
    const { hentNavKontor, navKontorResponse } = useHentNavKontor(behandlingId);
    const { hentBehandlingCallback, behandling } = useHentBehandling(behandlingId);
    const { hentBehandlingshistorikkCallback, behandlingHistorikk } =
        useHentBehandlingHistorikk(behandlingId);
    const { hentTotrinnskontrollCallback, totrinnskontroll } =
        useHentTotrinnskontroll(behandlingId);

    const [antallIRedigeringsmodus, settAntallIRedigeringsmodus] = useState<number>(0);
    const [ulagretData, settUlagretData] = useState<boolean>(antallIRedigeringsmodus !== 0);
    useEffect(() => settUlagretData(antallIRedigeringsmodus > 0), [antallIRedigeringsmodus]);

    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);
    const hentBehandlingshistorikk = useRerunnableEffect(hentBehandlingshistorikkCallback, [
        behandlingId,
    ]);

    const { hentRegler, regler } = useHentRegler();
    // eslint-disable-next-line
    useEffect(() => hentRegler(), [behandlingId]);

    const hentTotrinnskontroll = useRerunnableEffect(hentTotrinnskontrollCallback, [behandlingId]);
    // eslint-disable-next-line
    useEffect(() => hentPersonopplysninger(behandlingId), [behandlingId]);
    // eslint-disable-next-line
    useEffect(() => hentNavKontor(behandlingId), [behandlingId]);
    useEffect(
        () =>
            settBehandlingErRedigerbar(
                behandling.status === RessursStatus.SUKSESS &&
                    erBehandlingRedigerbar(behandling.data)
            ),
        [behandling]
    );

    return {
        behandling,
        behandlingErRedigerbar,
        totrinnskontroll,
        personopplysningerResponse,
        navKontorResponse,
        behandlingHistorikk,
        hentBehandling,
        hentTotrinnskontroll,
        hentBehandlingshistorikk,
        regler,
        antallIRedigeringsmodus,
        settAntallIRedigeringsmodus,
        ulagretData,
    };
});

export { BehandlingProvider, useBehandling };
