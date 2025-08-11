import { Beregning, TiProsentAvvik } from './BeregningsskjemaSide';

export const finnTiProsentAvvik = (beregning: Beregning): TiProsentAvvik => {
    const GRUNNBELØP = 130160; // Grunnbeløp for 2025
    const { årslønn, redusertEtter } = beregning;

    if (årslønn < redusertEtter && årslønn < redusertEtter * 0.9) {
        return TiProsentAvvik.NED;
    } else if (
        årslønn > GRUNNBELØP / 2 &&
        årslønn > redusertEtter &&
        årslønn > redusertEtter * 1.1
    ) {
        return TiProsentAvvik.OPP;
    } else if (
        årslønn < GRUNNBELØP / 2 &&
        årslønn > redusertEtter &&
        årslønn > redusertEtter * 1.1
    ) {
        return TiProsentAvvik.UNDER_HALV_G;
    } else {
        return TiProsentAvvik.NEI;
    }
};

export const rundTilNærmesteTusen = (årslønn: number): number => {
    return Math.round(årslønn / 1000) * 1000;
};

export const oppdaterÅrslønn = (
    beregning: Beregning,
    arbeidsgiverIndex: number,
    nyVerdi: number
) => {
    const oppdatertBeregning: Beregning = {
        ...beregning,
        arbeidsgivere: beregning.arbeidsgivere.map((ag, agIndex) =>
            agIndex === arbeidsgiverIndex ? { ...ag, verdi: nyVerdi } : ag
        ),
    };

    return rundTilNærmesteTusen(summerÅrslønn(oppdatertBeregning));
};

export const summerÅrslønn = (beregning: Beregning): number => {
    return beregning.arbeidsgivere.reduce((sum, ag) => sum + ag.verdi, 0) * 12;
};
