import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import {
    byggHenterRessurs,
    byggSuksessRessurs,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '../typer/ressurs';
import { AnsvarligSaksbehandler, AnsvarligSaksbehandlerRolle } from '../typer/saksbehandler';
import { Behandling } from '../typer/fagsak';
import { Steg } from '../../Komponenter/Behandling/Høyremeny/Steg';

export const useHentAnsvarligSaksbehandler = (behandling: Ressurs<Behandling>) => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [ansvarligSaksbehandler, settAnsvarligSaksbehandler] =
        useState<Ressurs<AnsvarligSaksbehandler>>(byggTomRessurs());

    /* I tilfeller hvor saksbehandler manuelt oppretter en revurdering eller en førstegangsbehandling vil OPPGAVE_FINNES_IKKE returneres fra backend.
     *  Dette skjer fordi NAV sitt interne oppgavesystem bruker litt tid av variabel lengde på opprette den tilhørende behandle-sak-oppgaven til
     *  den opprettede behandlingen.
     *
     *  Dersom OPPGAVE_FINNES_IKKE blir returnert og behandlingen befinner seg i steget for vilkårsvurdering anser vi det som svært sannsynlig
     *  at det egentlig er den innloggede saksbehandleren som er ansvarlig for behandlingen. */
    const utledAnsvarligSaksbehandler = useCallback(
        (response: Ressurs<AnsvarligSaksbehandler>, behandling: Behandling) => {
            console.log('utleder ansvarlig saksbehandler');
            console.log(behandling.steg);
            if (response.status === RessursStatus.SUKSESS) {
                console.log(response.data.rolle);
            }
            if (
                response.status === RessursStatus.SUKSESS &&
                response.data.rolle === AnsvarligSaksbehandlerRolle.OPPGAVE_FINNES_IKKE &&
                behandling.steg === Steg.VILKÅR
            ) {
                const saksbehandlerNavn = innloggetSaksbehandler.displayName.split(' ');
                const fornavn = saksbehandlerNavn[0];
                const etternavn = saksbehandlerNavn[saksbehandlerNavn.length - 1];
                settAnsvarligSaksbehandler(
                    byggSuksessRessurs<AnsvarligSaksbehandler>({
                        etternavn: etternavn,
                        fornavn: fornavn,
                        rolle: AnsvarligSaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER,
                    })
                );
            } else {
                settAnsvarligSaksbehandler(response);
            }
        }, // eslint-disable-next-line
        []
    );

    const hentAnsvarligSaksbehandlerCallback = useCallback(() => {
        if (behandling.status === RessursStatus.SUKSESS) {
            settAnsvarligSaksbehandler(byggHenterRessurs());
            axiosRequest<AnsvarligSaksbehandler, string>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgave/${behandling.data.id}/ansvarlig-saksbehandler`,
            }).then((res: Ressurs<AnsvarligSaksbehandler>) =>
                utledAnsvarligSaksbehandler(res, behandling.data)
            );
        }
    }, [axiosRequest, behandling, utledAnsvarligSaksbehandler]);

    return {
        ansvarligSaksbehandler,
        hentAnsvarligSaksbehandlerCallback,
    };
};
