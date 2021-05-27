import { BrevStruktur } from './BrevTyper';

export const finnFlettefeltNavnFraRef = (dokument: BrevStruktur, ref: string) => {
    return dokument.flettefelter.flettefeltReferanse.find((felt) => felt._id === ref)!.felt;
};
