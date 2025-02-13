import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IOppgaverResponse } from './useHentOppgaver';

export const useHentFremleggsoppgaverForOvergangsstønad = () => {
    const { axiosRequest } = useApp();
    const [fremleggsoppgaver, settFremleggsoppgaver] =
        useState<Ressurs<IOppgaverResponse>>(byggTomRessurs());

    const hentFremleggsoppgaver = useCallback(
        (behandlingId: string) => {
            settFremleggsoppgaver(byggHenterRessurs());
            axiosRequest<IOppgaverResponse, { behandlingId: string }>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgave/fremleggsoppgaver/${behandlingId}`,
            }).then((res: Ressurs<IOppgaverResponse>) => {
                settFremleggsoppgaver(res);
            });
        },
        [axiosRequest]
    );

    return { hentFremleggsoppgaver, fremleggsoppgaver };
};
