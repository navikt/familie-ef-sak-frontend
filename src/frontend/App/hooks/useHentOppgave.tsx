import { RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IOppgave } from '../../Komponenter/Oppgavebenk/typer/oppgave';

const tomOppgave: IOppgave = {
    id: 0,
    behandlesAvApplikasjon: '',
};

export const useHentOppgave = (behandlingId: string) => {
    const { axiosRequest } = useApp();
    const [oppgave, settOppgave] = useState<IOppgave>(tomOppgave);
    const [laster, settLaster] = useState(false);
    const [feilmelding, settFeilmelding] = useState<string | null>(null);

    const hentOppgave = useCallback(async () => {
        settLaster(true);
        settFeilmelding(null);
        try {
            const res = await axiosRequest<IOppgave, { behandlingId: string }>({
                method: 'GET',
                url: `/familie-ef-sak/api/oppgave/behandling/${behandlingId}`,
            });
            if (res.status === RessursStatus.SUKSESS) {
                settOppgave(res.data);
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        } finally {
            settLaster(false);
        }
    }, [axiosRequest, behandlingId]);

    return { hentOppgave, oppgave, laster, feilmelding };
};
