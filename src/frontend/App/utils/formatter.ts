import { format, parseISO } from 'date-fns';
import { harTallverdi } from './utils';

export const datoFormat = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
} as const;
export const datoTidFormat = { day: '2-digit', month: '2-digit', year: 'numeric' };
export const datoMånedÅrFormat = { month: 'short', year: 'numeric' } as const;
export const datoMånedÅrFormatFull = { month: 'long', year: 'numeric' } as const;
export const månedFormat = { month: 'short' } as const;

export const formaterNullableIsoDato = (dato?: string): string | undefined =>
    dato && formaterIsoDato(dato);

export const formaterIsoDato = (dato: string): string => {
    return parseISO(dato).toLocaleDateString('no-NO', datoFormat);
};

export const dagensDatoFormatert = (): string => {
    return new Date().toLocaleDateString('no-NO', datoFormat);
};

export const formaterIsoDatoTid = (dato: string): string => {
    return format(parseISO(dato), "dd.MM.yyyy 'kl'.HH:mm");
};

export const formaterNullableIsoDatoTid = (dato?: string): string | undefined => {
    return dato && formaterIsoDatoTid(dato);
};
export const formaterNullableMånedÅr = (dato?: string): string | undefined =>
    dato && format(parseISO(dato), 'MM.yyyy');

export const formaterIsoMånedÅr = (dato: string): string => {
    return parseISO(dato).toLocaleDateString('no-NO', datoMånedÅrFormat);
};

export const formaterIsoMånedÅrFull = (dato: string): string => {
    return parseISO(dato).toLocaleDateString('no-NO', datoMånedÅrFormatFull);
};

export const formaterIsoMåned = (dato: string): string => {
    return parseISO(dato).toLocaleDateString('no-NO', månedFormat);
};

export const formaterNullableIsoÅr = (dato?: string): number | undefined => {
    return dato ? formaterIsoÅr(dato) : undefined;
};

export const formaterIsoÅr = (dato: string): number => {
    return parseISO(dato).getFullYear();
};

export const formaterFødselsnummer = (fødselsnummer: string): string =>
    fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6);

export const formaterNullableFødsesnummer = (fødselsnummer?: string): string | undefined =>
    fødselsnummer && formaterFødselsnummer(fødselsnummer);

export const formaterTallMedTusenSkille = (verdi?: number): string =>
    harTallverdi(verdi) ? Number(verdi).toLocaleString('no-NO', { currency: 'NOK' }) : '';

export const formaterTallMedTusenSkilleEllerStrek = (verdi?: number): string =>
    harTallverdi(verdi) && verdi !== 0
        ? Number(verdi).toLocaleString('no-NO', { currency: 'NOK' })
        : '-';

export const formaterStrengMedStorForbokstav = (verdi: string): string =>
    verdi[0].toUpperCase() + verdi.slice(1).toLowerCase();
