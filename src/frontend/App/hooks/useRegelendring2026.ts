import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';

interface Regelendring2026Begrunnelse {
    begrunnelse: string;
}

export const useRegelendring2026 = (
    behandlingId: string
): {
    hentRegelendring2026Begrunnelse: () => void;
    regelendring2026Begrunnelse: Ressurs<Regelendring2026Begrunnelse | undefined>;
    lagreRegelendring2026Begrunnelse: (begrunnelse: string) => Promise<boolean>;
} => {
    const { axiosRequest } = useApp();
    const [regelendring2026Begrunnelse, settRegelendring2026Begrunnelse] =
        useState<Ressurs<Regelendring2026Begrunnelse | undefined>>(byggTomRessurs());

    const hentRegelendring2026Begrunnelse = useCallback(() => {
        axiosRequest<Regelendring2026Begrunnelse | null, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/regelendring-2026/begrunnelse`,
        }).then((res: RessursSuksess<Regelendring2026Begrunnelse | null> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                if (res.data) {
                    settRegelendring2026Begrunnelse(
                        res as RessursSuksess<Regelendring2026Begrunnelse>
                    );
                } else {
                    settRegelendring2026Begrunnelse({
                        status: RessursStatus.SUKSESS,
                        data: undefined,
                    });
                }
            } else {
                settRegelendring2026Begrunnelse(res);
            }
        });
    }, [behandlingId]);

    const lagreRegelendring2026Begrunnelse = useCallback(
        async (begrunnelse: string): Promise<boolean> => {
            const res = await axiosRequest<string, { begrunnelse: string }>({
                method: 'POST',
                url: `/familie-ef-sak/api/behandling/${behandlingId}/regelendring-2026/begrunnelse`,
                data: { begrunnelse },
            });
            if (res.status === RessursStatus.SUKSESS) {
                settRegelendring2026Begrunnelse({
                    status: RessursStatus.SUKSESS,
                    data: { begrunnelse },
                });
                return true;
            }
            return false;
        },
        [behandlingId]
    );

    return {
        hentRegelendring2026Begrunnelse,
        regelendring2026Begrunnelse,
        lagreRegelendring2026Begrunnelse,
    };
};
