import {
    addMonths,
    differenceInMonths,
    differenceInYears,
    getMonth,
    getYear,
    isAfter,
    isBefore,
    isEqual,
    parse,
    parseISO,
    areIntervalsOverlapping,
} from 'date-fns';

export const plusMåneder = (date: Date, antall: number): Date => addMonths(date, antall);

export const tilÅrMåned = (date: Date): string => {
    return date.toISOString().substr(0, 7);
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

export const månederMellom = (fra: Date, til: Date): number => {
    return differenceInMonths(addMonths(til, 1), fra);
};

export const erEtterDagensDato = (dato: string | Date): boolean => {
    return erEtter(dato, new Date());
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

export const tilDato = (dato: string | Date): Date =>
    typeof dato === 'string' ? parseISO(dato) : dato;

export const nullableDatoTilAlder = (dato?: string | Date): number | undefined => {
    return dato ? datoTilAlder(dato) : undefined;
};

export const datoTilAlder = (dato: string | Date): number => {
    return differenceInYears(new Date(), tilDato(dato));
};

export const tilSkoleår = (årMåned: string): number => {
    const dato = månedÅrTilDate(årMåned);
    const år = getYear(dato);
    return getMonth(dato) > 6 ? år : år - 1;
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
