import { parseISO } from 'date-fns';

export const datoFormat = { day: '2-digit', month: '2-digit', year: 'numeric' };

export const formaterNullableIsoDato = (dato?: string): string | undefined =>
    dato && formaterIsoDato(dato);

export const formaterIsoDato = (dato: string): string => {
    return parseISO(dato).toLocaleDateString('no-NO', datoFormat);
};

export const formaterFødselsnummer = (fødselsnummer: string) =>
    fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6);
