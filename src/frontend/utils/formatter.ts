import { parseISO } from 'date-fns';

export const datoFormat = { day: '2-digit', month: '2-digit', year: 'numeric' };

export const formaterIsoDato = (dato: string) => {
    return parseISO(dato).toLocaleDateString('no-NO', datoFormat);
};
