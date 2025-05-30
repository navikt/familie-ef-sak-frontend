import {
    addMonths,
    areIntervalsOverlapping,
    differenceInMonths,
    differenceInYears,
    formatISO,
    isAfter,
    isBefore,
    isEqual,
    isValid,
    parse,
    parseISO,
    subYears,
} from 'date-fns';

export const minusÅr = (date: Date, antall: number): Date => subYears(date, antall);

export const plusMåneder = (date: string | Date, antall: number): Date =>
    addMonths(tilDato(date), antall);

export const tilÅrMåned = (date: Date): string => {
    return formatISO(date).substring(0, 7);
};

export const månedÅrTilDate = (årMåned: string): Date => {
    return parse(årMåned, 'yyyy-MM', new Date());
};

export const erMånedÅrLik = (årMånedFra: string, årMånedTil: string): boolean => {
    const fra = månedÅrTilDate(årMånedFra);
    const til = månedÅrTilDate(årMånedTil);
    return isEqual(til, fra);
};

export const erMånedÅrEtterEllerLik = (årMånedFra: string, årMånedTil: string): boolean => {
    const fra = månedÅrTilDate(årMånedFra);
    const til = månedÅrTilDate(årMånedTil);
    return !isBefore(til, fra);
};

export const erMånedÅrEtter = (årMånedFra: string, årMånedTil: string): boolean => {
    const fra = månedÅrTilDate(årMånedFra);
    const til = månedÅrTilDate(årMånedTil);
    return isAfter(til, fra);
};

export const erPåfølgendeÅrMåned = (årMånedFra: string, årMånedTil: string): boolean =>
    differenceInMonths(månedÅrTilDate(årMånedTil), månedÅrTilDate(årMånedFra)) === 1;

export const månederMellom = (fra: Date, til: Date): number => {
    return differenceInMonths(addMonths(til, 1), fra);
};

export const erEtterDagensDato = (dato: string | Date): boolean => {
    return erEtter(dato, new Date());
};

export const erFørEllerLikDagensDato = (dato: string | Date): boolean => {
    return !erEtter(dato, new Date());
};

/**
 * @param first date the date that should be after the other one to return true
 * @param second dateToCompare the date to compare with
 */
export const erEtter = (first: string | Date, second: string | Date): boolean => {
    return isAfter(tilDato(first), tilDato(second));
};

export const gjelderÅr = (dato: string, år: number): boolean => {
    return parseISO(dato).getFullYear() === år;
};

const erGyldigFormat = (verdi: string) => {
    const YYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;

    if (verdi && String(verdi).match(YYYYMMDD)) {
        return true;
    } else {
        return false;
    }
};

export const erGyldigDato = (dato: string | Date): boolean =>
    typeof dato === 'string' ? erGyldigFormat(dato) && isValid(tilDato(dato)) : isValid(dato);

export const tilDato = (dato: string | Date): Date =>
    typeof dato === 'string' ? parseISO(dato) : dato;

export const tilLocaleDateString = (dato: Date) => formatISO(dato, { representation: 'date' });

export const nullableTilDato = (dato: string | Date | undefined): Date | undefined => {
    if (typeof dato === 'string') {
        return dato !== '' ? parseISO(dato) : undefined;
    } else {
        return dato;
    }
};

export const nullableDatoTilAlder = (dato?: string | Date | null): number | undefined => {
    return dato ? datoTilAlder(dato) : undefined;
};

export const datoTilAlder = (dato: string | Date): number => {
    return differenceInYears(new Date(), tilDato(dato));
};

export const årMellomDatoer = (from: string | Date, to: string | Date): number => {
    return differenceInYears(tilDato(to), tilDato(from));
};

export type Intervall = { fra: Date; til: Date };
export const overlapper = (periode1: Intervall, periode2: Intervall) =>
    areIntervalsOverlapping(
        { start: periode1.fra, end: periode1.til },
        { start: periode2.fra, end: periode2.til },
        { inclusive: true }
    );

export const kalkulerAntallMåneder = (
    årMånedFra?: string,
    årMånedTil?: string
): number | undefined => {
    if (årMånedFra && årMånedTil) {
        return månederMellom(månedÅrTilDate(årMånedFra), månedÅrTilDate(årMånedTil));
    }
    return undefined;
};

export const antallMånederSidenDato = (dato: string | Date): number => {
    const datoSomDate = tilDato(dato);
    const nåværendeDato = new Date();
    return Math.abs(differenceInMonths(nåværendeDato, datoSomDate));
};
