import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { TotrinnskontrollResponse } from '../typer/totrinnskontroll';
import { useCallback, useState } from 'react';
import { useApp } from '../context/AppContext';

// eslint-disable-next-line
export const useHentTotrinnskontroll = (behandlingId: string) => {
    const { axiosRequest } = useApp();
    const [totrinnskontroll, settTotrinnskontroll] = useState<Ressurs<TotrinnskontrollResponse>>(
        byggTomRessurs()
    );

    const hentTotrinnskontrollCallback = useCallback(() => {
        axiosRequest<TotrinnskontrollResponse, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/totrinnskontroll`,
        }).then((response: Ressurs<TotrinnskontrollResponse>) => {
            settTotrinnskontroll(response);
        });
    }, [behandlingId]);

    return {
        totrinnskontroll,
        hentTotrinnskontrollCallback,
    };
};
