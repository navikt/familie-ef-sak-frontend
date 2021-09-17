import {
    addMonths,
    differenceInMonths,
    isAfter,
    isBefore,
    isEqual,
    parse,
    parseISO,
} from 'date-fns';

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

export const erEtter = (first: string | Date, second: string | Date): boolean => {
    const d1: Date = typeof first === 'string' ? parseISO(first) : first;
    const d2: Date = typeof second === 'string' ? parseISO(second) : second;
    return isAfter(d2, d1);
};

export const gjelderÅr = (dato: string, år: number): boolean => {
    return parseISO(dato).getFullYear() === år;
};
