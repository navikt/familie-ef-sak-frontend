import { formaterStrengMedStorForbokstav } from '../../../App/utils/formatter';
import { AvvikEnum, Beregning, Periode, Beregninger } from './typer';

const GRUNNBELØP: number = 130160; /* TODO: bruke api - Grunnbeløp for 2025 */

export const finnGjennomsnittligAvvik = (beregninger: Beregning[]): AvvikEnum => {
    const årslønn = regnUtGjennomsnittÅrslønn(beregninger);
    const redusertEtter = regnUtGjennomsnittligRedusertEtter(beregninger);

    return utledAvvikEnum(årslønn, redusertEtter);
};

export const finnAvvik = (beregning: Beregning): AvvikEnum => {
    const { årslønn, redusertEtter } = beregning;
    return utledAvvikEnum(årslønn, redusertEtter);
};

const utledAvvikEnum = (årslønn: number, redusertEtter: number): AvvikEnum => {
    const GRUNNBELØP = 130160; // TODO: bruke api - Grunnbeløp for 2025

    if (årslønn < redusertEtter && årslønn < redusertEtter * 0.9) {
        return AvvikEnum.NED;
    } else if (
        årslønn > GRUNNBELØP / 2 &&
        årslønn > redusertEtter &&
        årslønn > redusertEtter * 1.1
    ) {
        return AvvikEnum.OPP;
    } else if (
        årslønn < GRUNNBELØP / 2 &&
        årslønn > redusertEtter &&
        årslønn > redusertEtter * 1.1
    ) {
        return AvvikEnum.UNDER_HALV_G;
    } else {
        return AvvikEnum.NEI;
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

export const oppdaterBeregnetfra = (
    beregninger: Beregning[],
    indeksSkalGjeldeFra?: number
): Beregning[] => {
    const resetBeregnetfra = beregninger.map((b) => ({ ...b, beregnetfra: false }));

    if (indeksSkalGjeldeFra !== undefined && indeksSkalGjeldeFra < beregninger.length) {
        return resetBeregnetfra.map((beregning, indeks) => ({
            ...beregning,
            beregnetfra: indeks === indeksSkalGjeldeFra,
        }));
    }

    const førsteMedAvvikOpp = beregninger.findIndex((b) => b.avvik === AvvikEnum.OPP);

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

    const fraMåned = parseInt(periode.fra.måned);
    const tilMåned = parseInt(periode.til.måned);

    const fraÅr = parseInt(periode.fra.årstall);
    const tilÅr = parseInt(periode.til.årstall);

    const antallPerioder = (tilÅr - fraÅr) * 12 + (tilMåned - fraMåned) + 1;

    const nyeBeregninger: Beregninger = [];

    for (let i = 0; i < antallPerioder; i++) {
        const årstall = fraÅr + Math.floor((fraMåned - 1 + i) / 12);
        const månedNummer = ((fraMåned - 1 + i) % 12) + 1;

        nyeBeregninger.push({
            periode: { årstall: årstall.toString(), måned: månedNummer.toString() },
            arbeidsgivere: [{ navn: `Arbeidsgiver ${i + 1}`, verdi: 0 }],
            årslønn: 0,
            redusertEtter: 0,
            avvik: AvvikEnum.INGEN_VERDI,
            beregnetfra: false,
        });
    }

    return nyeBeregninger;
};

export const mapMånedTallTilNavn = (månedTall: number | string): string => {
    const måned = typeof månedTall === 'string' ? parseInt(månedTall) : månedTall;

    const date = new Date();
    date.setMonth(måned - 1);

    return formaterStrengMedStorForbokstav(
        date.toLocaleString('no-NO', {
            month: 'long',
        })
    );
};

export const regnUtGjennomsnittÅrslønn = (beregninger: Beregning[]) =>
    regnUtGjennomsnitt(beregninger, (b) => b.årslønn);

export const regnUtGjennomsnittligRedusertEtter = (beregninger: Beregning[]) =>
    regnUtGjennomsnitt(beregninger, (b) => b.redusertEtter);

const regnUtGjennomsnitt = <Beregning>(
    beregninger: Beregning[],
    selector: (property: Beregning) => number
): number => {
    if (beregninger.length === 0) return 0;

    const sum = beregninger.reduce((acc, property) => acc + selector(property), 0);
    return sum / beregninger.length;
};

export const regnUtNyBeregning = (beregning: Beregning): number => {
    const { måned, årstall: år } = beregning.periode;
    const årstall = parseInt(år);
    const årslønn = beregning.årslønn;

    if (måned === '') return 0;
    if (årslønn === 0) return 0;

    const månedligUtbetaling = regnUtMånedligUtbetalingOvergangsstønad(årstall, GRUNNBELØP);
    const månedligReduksjon = regnUtMånedligReduksjon(årstall, årslønn);

    return månedligUtbetaling - månedligReduksjon;
};

const regnUtMånedligReduksjon = (årstall: number, verdi: number): number => {
    const GAMMEL_ORDNING = 40,
        NY_ORDNING = 45; // ny ordn. (etter 010414)

    let månedligReduksjon = 0;

    if (verdi > GRUNNBELØP / 2) {
        let reduseringsrate = 0;
        if (årstall < 2017) {
            reduseringsrate = GAMMEL_ORDNING;
        } else if (årstall > 2016) {
            reduseringsrate = NY_ORDNING;
        }

        månedligReduksjon = Math.round(((verdi - GRUNNBELØP / 2) / 12) * (reduseringsrate / 100));
    }

    return månedligReduksjon;
};

export const regnUtMånedligUtbetalingOvergangsstønad = (
    årstall: number,
    grunnbeløp: number
): number => {
    const TO = 2,
        TO_OG_EN_FJERDEDEL = 2.25;

    let overgangsstønad = 0;
    if (årstall < 2017) {
        overgangsstønad = grunnbeløp * TO;
    } else if (årstall > 2016) {
        overgangsstønad = grunnbeløp * TO_OG_EN_FJERDEDEL;
    }

    const månedligUtbetaling = Math.round(overgangsstønad / 12);
    return månedligUtbetaling;
};

export const regnUtHarMottatt = (beregning: Beregning): number => {
    const { måned, årstall: år } = beregning.periode;
    const årstall = parseInt(år);
    const redusertEtter = beregning.redusertEtter;

    if (måned === '') return 0;
    if (redusertEtter === 0) return 0;

    const månedligUtbetaling = regnUtMånedligUtbetalingOvergangsstønad(årstall, GRUNNBELØP);
    const månedligReduksjon = regnUtMånedligReduksjon(årstall, redusertEtter);

    return månedligUtbetaling - månedligReduksjon;
};

export const regnUtFeilutbetaling = (beregning: Beregning): number => {
    if (beregning.redusertEtter === 0 || beregning.årslønn === 0) return 0;

    const harMottatt = regnUtHarMottatt(beregning);
    const nyBeregning = regnUtNyBeregning(beregning);

    return harMottatt - nyBeregning;
};

export const regnUtSumFeilutbetaling = (beregninger: Beregning[]): number => {
    const feilutbetalinger = beregninger.map((b) => regnUtFeilutbetaling(b));

    const sumFeilutbetaling = feilutbetalinger
        .filter((feilutbetaling) => feilutbetaling > 0)
        .reduce((sum, feilutbetaling) => sum + feilutbetaling, 0);

    return sumFeilutbetaling;
};

export const regnUtMotregning = (beregninger: Beregning[]): number => {
    const feilutbetalinger = beregninger.map((b) => regnUtFeilutbetaling(b));

    const sumMotregning = feilutbetalinger
        .filter((feilutbetaling) => feilutbetaling < 0)
        .reduce((sum, feilutbetaling) => sum + feilutbetaling, 0);

    return sumMotregning;
};

export const lagBeregningFraOgMedBeregnetFra = (beregninger: Beregning[]): Beregning[] => {
    const oppdaterteBeregninger = beregninger.map((beregning) => ({
        ...beregning,
        avvik: finnAvvik(beregning),
    }));

    const beregningBeregnetFra = oppdaterteBeregninger.find(
        (beregning) => beregning.beregnetfra === true
    );

    if (beregningBeregnetFra) {
        const beregningBeregnetFraIndex = oppdaterteBeregninger.findIndex(
            (beregning) => beregning.beregnetfra === true
        );
        return oppdaterteBeregninger.slice(beregningBeregnetFraIndex);
    }

    return oppdaterteBeregninger;
};
