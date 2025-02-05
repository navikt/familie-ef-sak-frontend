import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { Samværsavtale } from '../typer/samværsavtale';

interface SamværsavtaleResponse {
    samværsavtaler: Ressurs<Samværsavtale[]>;
    hentSamværsavtaler: (behandlingId: string) => void;
}

export const useHentSamværsavtaler = (): SamværsavtaleResponse => {
    const { axiosRequest } = useApp();
    const [samværsavtaler, settSamværsavtaler] =
        useState<Ressurs<Samværsavtale[]>>(byggTomRessurs());

    const hentSamværsavtaler = useCallback(
        (behandlingId: string) => {
            settSamværsavtaler(byggHenterRessurs());
            axiosRequest<Samværsavtale[], null>({
                method: 'GET',
                url: `/familie-ef-sak/api/samvaersavtale/${behandlingId}`,
            }).then((res: Ressurs<Samværsavtale[]>) => settSamværsavtaler(res));
        },
        [axiosRequest]
    );

    return {
        samværsavtaler,
        hentSamværsavtaler,
    };
};
