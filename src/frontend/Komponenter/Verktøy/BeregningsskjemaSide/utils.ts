import { TiProsentAvvik, Beregning, Periode, Beregninger } from './typer';

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

export const oppdaterBeregnetfra = (beregninger: Beregning[]): Beregning[] => {
    const resetBeregnetfra = beregninger.map((b) => ({ ...b, beregnetfra: false }));
    const førsteMedAvvikOpp = beregninger.findIndex((b) => b.avvik === TiProsentAvvik.OPP);

    let beregnetfraIndeks = -1;
    if (førsteMedAvvikOpp !== -1 && førsteMedAvvikOpp + 1 < resetBeregnetfra.length) {
        beregnetfraIndeks = førsteMedAvvikOpp + 1;
    }

    const sattBeregnetfra = resetBeregnetfra.map((beregning, indeks) => ({
        ...beregning,
        beregnetfra: indeks === beregnetfraIndeks,
    }));

    return sattBeregnetfra;
};

export const lagBeregninger = (periode: Periode) => {
    if (!periode || !periode.fra.årstall || !periode.til.årstall) {
        return [];
    }

    const mapMåned: { [key: string]: number } = {
        januar: 1,
        februar: 2,
        mars: 3,
        april: 4,
        mai: 5,
        juni: 6,
        juli: 7,
        august: 8,
        september: 9,
        oktober: 10,
        november: 11,
        desember: 12,
    };

    const fraMåned = mapMåned[periode.fra.måned.toLowerCase()] || 1;
    const tilMåned = mapMåned[periode.til.måned.toLowerCase()] || 12;

    const fraÅr = parseInt(periode.fra.årstall);
    const tilÅr = parseInt(periode.til.årstall);

    const antallPerioder = (tilÅr - fraÅr) * 12 + (tilMåned - fraMåned) + 1;

    const nyeBeregninger: Beregninger = [];

    for (let i = 0; i < antallPerioder; i++) {
        const årstall = fraÅr + Math.floor((fraMåned - 1 + i) / 12);
        const månedNummer = ((fraMåned - 1 + i) % 12) + 1;

        const månedNavn =
            Object.keys(mapMåned).find((key) => mapMåned[key] === månedNummer) || 'MÅNED';

        nyeBeregninger.push({
            periode: { årstall: årstall.toString(), måned: månedNavn },
            arbeidsgivere: [{ navn: `Arbeidsgiver ${i + 1}`, verdi: 0 }],
            årslønn: 0,
            redusertEtter: 0,
            avvik: TiProsentAvvik.INGEN_VERDI,
            beregnetfra: false,
        });
    }

    return nyeBeregninger;
};
