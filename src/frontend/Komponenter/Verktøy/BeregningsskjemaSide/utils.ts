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
    const GRUNNBELØP = 130160; // Grunnbeløp for 2025

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
