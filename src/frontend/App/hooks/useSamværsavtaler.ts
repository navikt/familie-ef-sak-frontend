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
import { JournalførBeregnetSamværRequest, Samværsavtale } from '../typer/samværsavtale';

interface SamværsavtaleResponse {
    samværsavtaler: Ressurs<Samværsavtale[]>;
    hentSamværsavtaler: (behandlingId: string) => void;
    lagreSamværsavtale: (avtale: Samværsavtale) => void;
    slettSamværsavtale: (behandlingId: string, behandlingBarnId: string) => void;
    journalførBeregnetSamvær: (
        request: JournalførBeregnetSamværRequest,
        handleSuccess: () => void
    ) => void;
    feilmelding: string;
    settFeilmelding: React.Dispatch<React.SetStateAction<string>>;
}

export const useSamværsavtaler = (): SamværsavtaleResponse => {
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
            axiosRequest<Samværsavtale[], Samværsavtale>({
                method: 'POST',
                url: `/familie-ef-sak/api/samvaersavtale`,
                data: avtale,
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

    const slettSamværsavtale = useCallback(
        (behandlingId: string, behandlingBarnId: string) => {
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

    const journalførBeregnetSamvær = useCallback(
        (request: JournalførBeregnetSamværRequest, handleSuccess: () => void) => {
            axiosRequest<string, JournalførBeregnetSamværRequest>({
                method: 'POST',
                url: `/familie-ef-sak/api/samvaersavtale/journalfor`,
                data: request,
            }).then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    handleSuccess();
                    settFeilmelding('');
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
        journalførBeregnetSamvær,
        feilmelding,
        settFeilmelding,
    };
};
