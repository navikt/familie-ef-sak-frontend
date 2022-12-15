import {
    byggSuksessRessurs,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { EBehandlingResultat, IVedtakForOvergangsstønad } from '../typer/vedtak';

export const harVedtaksresultatMedTilkjentYtelse = (
    vedtaksresultat: EBehandlingResultat | undefined
): boolean => {
    if (vedtaksresultat) {
        return (
            vedtaksresultat === EBehandlingResultat.INNVILGE ||
            vedtaksresultat === EBehandlingResultat.INNVILGE_UTEN_UTBETALING ||
            vedtaksresultat === EBehandlingResultat.SANKSJONERE ||
            vedtaksresultat === EBehandlingResultat.OPPHØRT
        );
    }
    return false;
};

export const useHentVedtak = (
    behandlingId: string | undefined
): {
    hentVedtak: () => void;
    vedtak: Ressurs<IVedtakForOvergangsstønad | undefined>;
    vedtaksresultat: EBehandlingResultat | undefined;
} => {
    const { axiosRequest } = useApp();
    const [vedtak, settVedtak] = useState<Ressurs<IVedtakForOvergangsstønad | undefined>>(
        byggTomRessurs()
    );
    const [vedtaksresultat, settVedtaksresultat] = useState<EBehandlingResultat>();

    const hentVedtak = useCallback(() => {
        if (!behandlingId) {
            settVedtak(byggSuksessRessurs(undefined));
        } else {
            const behandlingConfig: AxiosRequestConfig = {
                method: 'GET',
                url: `/familie-ef-sak/api/vedtak/${behandlingId}`,
            };
            axiosRequest<IVedtakForOvergangsstønad | null, null>(behandlingConfig).then(
                (res: RessursSuksess<IVedtakForOvergangsstønad | null> | RessursFeilet) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        if (res.data) {
                            settVedtak(res as RessursSuksess<IVedtakForOvergangsstønad>);
                            settVedtaksresultat(res.data.resultatType);
                        } else {
                            settVedtak(byggSuksessRessurs(undefined));
                        }
                    } else {
                        settVedtak(res);
                        settVedtaksresultat(undefined);
                    }
                }
            );
        }
        // eslint-disable-next-line
    }, [behandlingId]);

    return {
        hentVedtak,
        vedtak,
        vedtaksresultat,
    };
};
