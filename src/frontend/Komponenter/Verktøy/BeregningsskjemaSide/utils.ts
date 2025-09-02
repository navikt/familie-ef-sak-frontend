import { formaterStrengMedStorForbokstav } from '../../../App/utils/formatter';
import { AvvikEnum, Beregning, Periode, Beregninger } from './typer';

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

export const oppdaterBeregnetfra = (beregninger: Beregning[]): Beregning[] => {
    const resetBeregnetfra = beregninger.map((b) => ({ ...b, beregnetfra: false }));
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

/**
 * Beregner ny månedlig beregning basert på årslønn, periode og grunnbeløp.
 *
 * Excel-utregning:
 * =IF(NOT(I20="");IF(NOT(R20="");
 * MAX(ROUND(IF(AND(H20<2017;$BP$2=2);
 * E20*$BO$3;IF(OR(H20>2016;$BP$2=3);
 * E20*$BO$4;0))/12;0)-IF(NOT(R20="");
 * IF(R20>E20/2;ROUND(((R20-(E20/2))/12)*(IF(AND(H20<2017;$BP$2=2);
 * $BN$3;IF(OR(H20>2016;$BP$2=3);$BN$4;0))/100);0);0);0);0);"");"")
 *
 * @param beregning - Beregning-objekt med periode og årslønn
 * @returns Ny månedlig beregning (number)
 */
export const regnUtNyBeregning = (beregning: Beregning): number => {
    const { måned, årstall: år } = beregning.periode;
    const årstall = parseInt(år);
    const årslønn = beregning.årslønn;

    const GRUNNBELØP: number = 130160 /* TODO: bruke api - Grunnbeløp for 2025 */,
        TO = 2,
        TO_OG_EN_FJERDEDEL = 2.25,
        GAMMEL_ORDNING = 40,
        NY_ORDNING = 45; // ny ordn. (etter 010414)

    if (måned === '') return 0;
    if (årslønn === 0) return 0;

    let basis = 0;
    if (årstall < 2017) {
        basis = GRUNNBELØP * TO;
    } else if (årstall > 2016) {
        basis = GRUNNBELØP * TO_OG_EN_FJERDEDEL;
    }

    const månedligUtbetaling = Math.round(basis / 12);

    let månedligReduksjon = 0;

    if (årslønn > GRUNNBELØP / 2) {
        let reduseringsrate = 0;
        if (årstall < 2017) {
            reduseringsrate = GAMMEL_ORDNING;
        } else if (årstall > 2016) {
            reduseringsrate = NY_ORDNING;
        }

        månedligReduksjon = Math.round(((årslønn - GRUNNBELØP / 2) / 12) * (reduseringsrate / 100));
    }

    return månedligUtbetaling - månedligReduksjon;
};
