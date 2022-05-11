import { byggSuksessRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import {
    EBehandlingResultat,
    IBeløpsperiode,
    IBeregningsperiodeBarnetilsyn,
} from '../typer/vedtak';
import { Stønadstype } from '../typer/behandlingstema';
import { harVedtaksresultatMedTilkjentYtelse } from './useHentVedtak';

export const useHentBeløpsperioder = (
    behandlingId: string,
    stønadstype: Stønadstype
): {
    hentBeløpsperioder: (vedtaksresultat: EBehandlingResultat | undefined) => void;
    beløpsperioder: Ressurs<IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[] | undefined>;
} => {
    const { axiosRequest } = useApp();
    const [beløpsperioder, settBeløpsperioder] = useState<
        Ressurs<IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[] | undefined>
    >(byggTomRessurs());

    const lagBeløpsurl = useCallback(() => {
        switch (stønadstype) {
            case Stønadstype.OVERGANGSSTØNAD:
                return `/familie-ef-sak/api/beregning/${behandlingId}`;
            case Stønadstype.BARNETILSYN:
                return `/familie-ef-sak/api/beregning/barnetilsyn/${behandlingId}`;
            case Stønadstype.SKOLEPENGER:
                return `/familie-ef-sak/api/beregning/skolepenger/${behandlingId}`;
        }
    }, [behandlingId, stønadstype]);

    const hentBeløpsperioder = useCallback(
        (vedtaksresultat: EBehandlingResultat | undefined) => {
            if (
                harVedtaksresultatMedTilkjentYtelse(vedtaksresultat) &&
                vedtaksresultat != EBehandlingResultat.OPPHØRT
            ) {
                const behandlingConfig: AxiosRequestConfig = {
                    method: 'GET',
                    url: lagBeløpsurl(),
                };
                axiosRequest<IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[] | undefined, null>(
                    behandlingConfig
                ).then(
                    (
                        res: Ressurs<IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[] | undefined>
                    ) => {
                        settBeløpsperioder(res);
                    }
                );
            } else {
                settBeløpsperioder(byggSuksessRessurs(undefined));
            }
        },
        [settBeløpsperioder, axiosRequest, lagBeløpsurl]
    );

    return {
        hentBeløpsperioder,
        beløpsperioder,
    };
};
