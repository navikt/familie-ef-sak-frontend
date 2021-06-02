import { BrevStruktur } from './BrevTyper';

export const finnFlettefeltNavnFraRef = (dokument: BrevStruktur, ref: string): string => {
    const flettefeltNavnFraRef = dokument?.flettefelter?.flettefeltReferanse?.find(
        (felt) => felt._id === ref
    );
    return flettefeltNavnFraRef ? flettefeltNavnFraRef.felt : '';
};
