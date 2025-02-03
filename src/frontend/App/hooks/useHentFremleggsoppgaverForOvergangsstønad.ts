import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IOppgave } from '../../Komponenter/Oppgavebenk/typer/oppgave';

export interface IOppgaverResponse {
    antallTreffTotalt: number;
    oppgaver: IOppgave[];
}

export const useHentFremleggsoppgaverForOvergangsstønad = () => {
    const { axiosRequest } = useApp();
    const [fremleggsoppgaver, settFremleggsoppgaver] =
        useState<Ressurs<IOppgaverResponse>>(byggTomRessurs());

    const hentFremleggsoppgaver = useCallback(
        (behandlingId: string) => {
            settFremleggsoppgaver(byggHenterRessurs());
            axiosRequest<IOppgaverResponse, { behandlingId: string }>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgave/hent-fremleggsoppgaver/${behandlingId}`,
            }).then((res: Ressurs<IOppgaverResponse>) => {
                settFremleggsoppgaver(res);
            });
        },
        [axiosRequest]
    );

    return { hentFremleggsoppgaver, fremleggsoppgaver };
};
