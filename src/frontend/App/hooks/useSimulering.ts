import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';

interface ISimulering {
    dummy: string;
}

export const useSimulering = (
    behandlingId: string
): {
    simuleringsresultat: Ressurs<ISimulering>;
} => {
    const { axiosRequest } = useApp();
    const [simuleringsresultat, settSimuleringsresultat] = useState<Ressurs<ISimulering>>(
        byggTomRessurs()
    );

    useEffect(() => {
        const hentSimuleringConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-ef-sak/api/simulering/${behandlingId}`,
        };
        axiosRequest<ISimulering, null>(hentSimuleringConfig).then((res: Ressurs<ISimulering>) =>
            settSimuleringsresultat(res)
        );
        // eslint-disable-next-line
    }, [behandlingId]);

    return {
        simuleringsresultat,
    };
};
