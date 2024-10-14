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

export const useHentAnsvarligSaksbehandler = (behandlingId: string) => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [ansvarligSaksbehandler, settAnsvarligSaksbehandler] =
        useState<Ressurs<AnsvarligSaksbehandler>>(byggTomRessurs());

    const utledAnsvarligSaksbehandler = useCallback(
        (response: Ressurs<AnsvarligSaksbehandler>) => {
            if (
                response.status === RessursStatus.SUKSESS &&
                response.data.rolle === AnsvarligSaksbehandlerRolle.OPPGAVE_FINNES_IKKE
            ) {
                settAnsvarligSaksbehandler(
                    byggSuksessRessurs<AnsvarligSaksbehandler>({
                        etternavn: innloggetSaksbehandler.firstName,
                        fornavn: innloggetSaksbehandler.lastName,
                        rolle: AnsvarligSaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER,
                    })
                );
            } else {
                settAnsvarligSaksbehandler(response);
            }
        },
        [innloggetSaksbehandler.firstName, innloggetSaksbehandler.lastName]
    );

    const hentAnsvarligSaksbehandlerCallback = useCallback(() => {
        settAnsvarligSaksbehandler(byggHenterRessurs());
        axiosRequest<AnsvarligSaksbehandler, string>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/${behandlingId}/ansvarlig-saksbehandler`,
        }).then((res: Ressurs<AnsvarligSaksbehandler>) => utledAnsvarligSaksbehandler(res));
    }, [axiosRequest, behandlingId, utledAnsvarligSaksbehandler]);

    return {
        ansvarligSaksbehandler,
        hentAnsvarligSaksbehandlerCallback,
    };
};
