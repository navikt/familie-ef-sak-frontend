import { format, parseISO } from 'date-fns';
import { harTallverdi } from './utils';

export const datoFormat = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
} as const;
export const datoTidFormat = { day: '2-digit', month: '2-digit', year: 'numeric' };
export const datoMånedÅrFormat = { month: 'short', year: 'numeric' } as const;

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

export const formaterFødselsnummer = (fødselsnummer: string): string =>
    fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6);

export const formaterNullableFødsesnummer = (fødselsnummer?: string): string | undefined =>
    fødselsnummer && formaterFødselsnummer(fødselsnummer);

export const formaterTallMedTusenSkille = (verdi?: number): string =>
    harTallverdi(verdi)
        ? Number(verdi).toLocaleString('no-NO', { style: 'currency', currency: 'NOK' })
        : '';
