import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import {
    byggHenterRessurs,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';
import { Samværsavtale } from '../typer/samværsavtale';

interface SamværsavtaleResponse {
    samværsavtaler: Ressurs<Samværsavtale[]>;
    hentSamværsavtaler: (behandlingId: string) => void;
    lagreSamværsavtale: (avtale: Samværsavtale) => void;
    slettSamværsavtale: (behandlingId: string, behandlingBarnId: string) => void;
    feilmelding: string;
}

export const useHentSamværsavtaler = (): SamværsavtaleResponse => {
    const { axiosRequest } = useApp();
    const [samværsavtaler, settSamværsavtaler] =
        useState<Ressurs<Samværsavtale[]>>(byggTomRessurs());
    const [feilmelding, settFeilmelding] = useState<string>('');

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

    const lagreSamværsavtale = useCallback(
        (avtale: Samværsavtale) => {
            axiosRequest<Samværsavtale, Samværsavtale>({
                method: 'POST',
                url: `/familie-ef-sak/api/samvaersavtale`,
                data: avtale,
            }).then((res: RessursSuksess<Samværsavtale> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settFeilmelding('');
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            });
        },
        [axiosRequest]
    );

    const slettSamværsavtale = useCallback(
        (behandlingId: string, behandlingBarnId: string) => {
            settSamværsavtaler(byggHenterRessurs());
            axiosRequest<Samværsavtale[], null>({
                method: 'DELETE',
                url: `/familie-ef-sak/api/samvaersavtale/${behandlingId}/${behandlingBarnId}`,
            }).then((res: RessursSuksess<Samværsavtale[]> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settFeilmelding('');
                    settSamværsavtaler(res);
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            });
        },
        [axiosRequest]
    );

    return {
        samværsavtaler,
        hentSamværsavtaler,
        lagreSamværsavtale,
        slettSamværsavtale,
        feilmelding,
    };
};
