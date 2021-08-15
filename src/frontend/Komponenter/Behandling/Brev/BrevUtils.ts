import { BrevStruktur, Delmal, FlettefeltMedVerdi, ValgtFelt } from './BrevTyper';

export const finnFlettefeltVisningsnavnFraRef = (dokument: BrevStruktur, ref: string): string => {
    const flettefeltNavnFraRef = dokument?.flettefelter?.flettefeltReferanse?.find(
        (felt) => felt._id === ref
    );

    if (!flettefeltNavnFraRef) return '';

    return flettefeltNavnFraRef.feltVisningsnavn
        ? flettefeltNavnFraRef.feltVisningsnavn
        : flettefeltNavnFraRef.felt;
};

export const finnFletteFeltApinavnFraRef = (dokument: BrevStruktur, ref: string): string => {
    const flettefeltNavnFraRef = dokument?.flettefelter?.flettefeltReferanse?.find(
        (felt) => felt._id === ref
    );

    return flettefeltNavnFraRef ? flettefeltNavnFraRef.felt : '';
};

export const erFlettefeltFritektsfelt = (dokument: BrevStruktur, ref: string): boolean => {
    const flettefeltFraRef = dokument?.flettefelter?.flettefeltReferanse?.find(
        (felt) => felt._id === ref
    );

    return flettefeltFraRef?.erFritektsfelt || false;
};

export const grupperDelmaler = (delmaler: Delmal[]): { [mappeNavn: string]: Delmal[] } => {
    return delmaler.reduce((acc: { [mappeNavn: string]: Delmal[] }, delmal: Delmal) => {
        (acc[delmal.mappe] = acc[delmal.mappe] || []).push(delmal);
        return acc;
    }, {});
};

const hentVerdiFraMellomlagerEllerNull = (
    flettefeltFraMellomlager: FlettefeltMedVerdi[] | undefined,
    feltId: string
) => {
    if (flettefeltFraMellomlager) {
        return (
            flettefeltFraMellomlager.find((flettefelt) => flettefelt._ref === feltId)?.verdi || null
        );
    }
    return null;
};
export const initFlettefelterMedVerdi = (
    brevStruktur: BrevStruktur,
    flettefeltFraMellomlager: FlettefeltMedVerdi[] | undefined
): FlettefeltMedVerdi[] =>
    brevStruktur.flettefelter.flettefeltReferanse.map((felt) => ({
        _ref: felt._id,
        verdi: hentVerdiFraMellomlagerEllerNull(flettefeltFraMellomlager, felt._id),
    }));
export const initValgteFeltMedMellomlager = (
    valgteFeltFraMellomlager: ValgtFelt | undefined,
    brevStruktur: BrevStruktur
): ValgtFelt =>
    Object.entries(valgteFeltFraMellomlager || {}).reduce(
        (andreValgteFelt, [valgfeltApiNavn, mulighet]) => {
            const flettefeltForValgmulighetUtenVerdiFraSanity =
                brevStruktur.dokument.delmalerSortert.flatMap(
                    (delmal) =>
                        delmal.delmalValgfelt
                            .find((valgFelt) => valgFelt.valgFeltApiNavn === valgfeltApiNavn)
                            ?.valgMuligheter.find(
                                (valgmulighet) =>
                                    valgmulighet.valgmulighet === mulighet.valgmulighet
                            )?.flettefelter
                );
            return {
                ...andreValgteFelt,
                [valgfeltApiNavn]: {
                    ...mulighet,
                    flettefelter: flettefeltForValgmulighetUtenVerdiFraSanity.filter(Boolean),
                },
            };
        },
        {}
    );
