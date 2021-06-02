import { BrevStruktur, Delmal } from './BrevTyper';

export const finnFlettefeltNavnFraRef = (dokument: BrevStruktur, ref: string): string => {
    const flettefeltNavnFraRef = dokument?.flettefelter?.flettefeltReferanse?.find(
        (felt) => felt._id === ref
    );
    return flettefeltNavnFraRef ? flettefeltNavnFraRef.felt : '';
};
export const grupperDelmaler = (delmaler: Delmal[]): { [mappeNavn: string]: Delmal[] } => {
    return delmaler.reduce((acc: { [mappeNavn: string]: Delmal[] }, delmal: Delmal) => {
        (acc[delmal.mappe] = acc[delmal.mappe] || []).push(delmal);
        return acc;
    }, {});
};
