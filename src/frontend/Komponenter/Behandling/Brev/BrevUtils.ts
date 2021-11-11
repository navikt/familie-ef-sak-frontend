import {
    AvsnittMedId,
    BrevStruktur,
    Delmal,
    FlettefeltMedVerdi,
    IFritekstBrev,
    IFrittståendeBrev,
    ValgtFelt,
} from './BrevTyper';
import { v4 as uuidv4 } from 'uuid';

const lagTomtAvsnitt = (): AvsnittMedId => ({
    deloverskrift: '',
    innhold: '',
    id: uuidv4(),
});

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

export const grupperDelmaler = (delmaler: Delmal[]): { [gruppeVisningsnavn: string]: Delmal[] } => {
    return delmaler.reduce((acc: { [gruppeVisningsnavn: string]: Delmal[] }, delmal: Delmal) => {
        (acc[delmal.gruppeVisningsnavn] = acc[delmal.gruppeVisningsnavn] || []).push(delmal);
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
    flettefeltFraMellomlager: FlettefeltMedVerdi[] | undefined,
    flettefeltStore: { [flettefeltNavn: string]: string }
): FlettefeltMedVerdi[] =>
    brevStruktur.flettefelter.flettefeltReferanse.map((flettefeltReferanse) => ({
        _ref: flettefeltReferanse._id,
        verdi:
            flettefeltStore[flettefeltReferanse.felt] ||
            hentVerdiFraMellomlagerEllerNull(flettefeltFraMellomlager, flettefeltReferanse._id),
    }));

export const initValgteFeltMedMellomlager = (
    valgteFeltFraMellomlager: ValgtFelt | undefined,
    brevStruktur: BrevStruktur
): ValgtFelt =>
    Object.entries(valgteFeltFraMellomlager || {}).reduce((acc, [valgfeltApiNavn, mulighet]) => {
        const utledOppdaterteFlettefeltFraSanity = () =>
            brevStruktur.dokument.delmalerSortert.flatMap((delmal) => {
                const valgfelt = delmal.delmalValgfelt.find(
                    (valgFelt) => valgFelt.valgFeltApiNavn === valgfeltApiNavn
                );

                const valgtValgmulighet = valgfelt?.valgMuligheter.find(
                    (valgmulighet) => valgmulighet.valgmulighet === mulighet.valgmulighet
                );

                const flettefeltFraSanity = valgtValgmulighet?.flettefelter || [];

                return flettefeltFraSanity;
            });

        return {
            ...acc,
            [valgfeltApiNavn]: {
                ...mulighet,
                flettefelter: utledOppdaterteFlettefeltFraSanity(),
            },
        };
    }, {});

export const initielleAvsnittMellomlager = (
    mellomlagretFritekstbrev: IFritekstBrev | IFrittståendeBrev | undefined
): AvsnittMedId[] =>
    mellomlagretFritekstbrev
        ? mellomlagretFritekstbrev.avsnitt.map((avsnitt) => ({ ...avsnitt, id: uuidv4() }))
        : [];

export const skjulAvsnittIBrevbygger = (avsnitt: AvsnittMedId[]): AvsnittMedId[] =>
    avsnitt.map((avsnitt) => ({ ...avsnitt, skalSkjulesIBrevbygger: true }));

export const leggAvsnittBakSisteSynligeAvsnitt = (
    eksisterendeAvsnitt: AvsnittMedId[]
): AvsnittMedId[] => {
    const førsteSkjulteAvsnitt = eksisterendeAvsnitt.findIndex(
        (avsnitt) => avsnitt.skalSkjulesIBrevbygger
    );

    return [
        ...eksisterendeAvsnitt.slice(0, førsteSkjulteAvsnitt),
        lagTomtAvsnitt(),
        ...eksisterendeAvsnitt.slice(førsteSkjulteAvsnitt),
    ];
};

export const leggTilAvsnittForran = (eksisterendeAvsnitt: AvsnittMedId[]): AvsnittMedId[] => {
    return [lagTomtAvsnitt(), ...eksisterendeAvsnitt];
};
