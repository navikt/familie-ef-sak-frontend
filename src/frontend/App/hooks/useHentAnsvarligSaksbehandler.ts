import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { AnsvarligSaksbehandler } from '../typer/saksbehandler';

export const useHentAnsvarligSaksbehandler = (behandlingId: string) => {
    const { axiosRequest } = useApp();
    const [ansvarligSaksbehandler, settAnsvarligSaksbehandler] = useState<
        Ressurs<AnsvarligSaksbehandler>
    >(byggTomRessurs());

    const hentAnsvarligSaksbehandlerCallback = useCallback(() => {
        settAnsvarligSaksbehandler(byggHenterRessurs());
        axiosRequest<AnsvarligSaksbehandler, string>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/${behandlingId}/ansvarlig-saksbehandler`,
        }).then((res: Ressurs<AnsvarligSaksbehandler>) => settAnsvarligSaksbehandler(res));
    }, [axiosRequest, behandlingId]);

    return {
        ansvarligSaksbehandler,
        hentAnsvarligSaksbehandlerCallback,
    };
};
