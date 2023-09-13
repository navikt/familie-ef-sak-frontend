import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

export interface AnsvarligSaksbehandler {
    azureId: string;
    enhet: string;
    etternavn: string;
    fornavn: string;
    navIdent: string;
}

export const useHentAnsvarligSaksbehandler = (behandlingId: string) => {
    const { axiosRequest } = useApp();
    const [ansvarligSaksbehandler, settAnsvarligSaksbehandler] = useState<
        Ressurs<AnsvarligSaksbehandler | null>
    >(byggTomRessurs());

    const hentAnsvarligSaksbehandler = useCallback(() => {
        settAnsvarligSaksbehandler(byggHenterRessurs());
        axiosRequest<AnsvarligSaksbehandler | null, string>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/${behandlingId}/ansvarlig-saksbehandler`,
        }).then((res: Ressurs<AnsvarligSaksbehandler | null>) => settAnsvarligSaksbehandler(res));
    }, [axiosRequest, behandlingId]);

    return {
        ansvarligSaksbehandler,
        hentAnsvarligSaksbehandler,
    };
};
