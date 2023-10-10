import { Ressurs } from '@navikt/familie-typer';
import { useCallback, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RessursStatus } from '../../typer/ressurs';

type GrunnbeløpData = {
    periode: { fom: string; tom: string };
    grunnbeløp: number;
    grunnbeløpPerMåned: number;
    gjennomsnittPerÅr: number;
    seksGangerGrunnbeløp: number;
    seksGangerGrunnbeløpPerMåned: number;
};

const tomGrunnbeløpsdata: GrunnbeløpData[] = [];

export const useHentNyesteGrunnbeløpOgAntallGrunnløpsperioderTilbakeITid = (antall: number) => {
    const { axiosRequest } = useApp();

    const [grunnbeløpsperioder, settGrunnbeløpsperioder] =
        useState<GrunnbeløpData[]>(tomGrunnbeløpsdata);

    const hentGrunnbeløpsperioderCallback = useCallback(() => {
        axiosRequest<GrunnbeløpData[], { antall: number }>({
            method: 'GET',
            url: `/familie-ef-sak/api/beregning/grunnbelopForPerioder`,
            params: { antall },
        }).then((res: Ressurs<GrunnbeløpData[]>) => {
            res.status === RessursStatus.SUKSESS && settGrunnbeløpsperioder(res.data);
        });
    }, [axiosRequest, antall]);

    return {
        grunnbeløpsperioder,
        hentGrunnbeløpsperioderCallback,
    };
};
