import { parseISO } from 'date-fns';

export const datoFormat = { day: '2-digit', month: '2-digit', year: 'numeric' };

export const tilLokalDatoStreng = (datostreng: string) => {
    return parseISO(datostreng).toLocaleDateString('no-NO', datoFormat);
};
