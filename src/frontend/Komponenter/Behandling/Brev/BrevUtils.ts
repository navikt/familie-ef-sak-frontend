import {
    AvsnittMedId,
    BrevStruktur,
    Delmal,
    FlettefeltMedVerdi,
    IFritekstBrev,
    IFrittståendeBrev,
    Valgmulighet,
    ValgtFelt,
} from './BrevTyper';
import { v4 as uuidv4 } from 'uuid';
import { Dispatch, SetStateAction } from 'react';

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
    brevStruktur: BrevStruktur,
    settFeil: Dispatch<SetStateAction<string>>
): ValgtFelt =>
    Object.entries(valgteFeltFraMellomlager || {}).reduce((acc, [valgfeltApiNavn, mulighet]) => {
        validerValgfelterFraMellomlager(valgfeltApiNavn, mulighet, brevStruktur, settFeil);

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

const validerValgfelterFraMellomlager = (
    valgfeltApiNavn: string,
    valgtMulighet: Valgmulighet,
    brevStruktur: BrevStruktur,
    settFeil: Dispatch<SetStateAction<string>>
) => {
    brevStruktur.dokument.delmalerSortert.flatMap((delmal) => {
        const valgfelt = delmal.delmalValgfelt.find(
            (valgFelt) => valgFelt.valgFeltApiNavn === valgfeltApiNavn
        );

        if (valgfelt) {
            const mellomlagerHarGyldigValg = valgfelt.valgMuligheter.some(
                (mulighetFraStruktur) =>
                    mulighetFraStruktur.valgmulighet === valgtMulighet.valgmulighet
            );

            if (!mellomlagerHarGyldigValg) {
                settFeil(
                    `En endring har skjedd i brevmalen siden forrige mellomlagring. Valget ${valgtMulighet.visningsnavnValgmulighet} under ${valgfelt.valgfeltVisningsnavn} er ikke lengre et gyldig valg. Vennligst ta stilling til det på nytt`
                );
            }
        }
    });
};

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

export const leggTilAvsnittFørst = (eksisterendeAvsnitt: AvsnittMedId[]): AvsnittMedId[] => {
    return [lagTomtAvsnitt(), ...eksisterendeAvsnitt];
};

export const flyttAvsnittOppover = (
    avsnittId: string,
    eksisterendeAvsnitt: AvsnittMedId[]
): AvsnittMedId[] => {
    const avsnittSomSkalFlyttesIndeks = eksisterendeAvsnitt.findIndex(
        (avsnitt) => avsnitt.id === avsnittId
    );
    const avsnittFørIndeks = avsnittSomSkalFlyttesIndeks - 1;
    const avsnittEtterIndeks = avsnittSomSkalFlyttesIndeks + 1;

    return [
        ...eksisterendeAvsnitt.slice(0, avsnittFørIndeks),
        eksisterendeAvsnitt[avsnittSomSkalFlyttesIndeks],
        eksisterendeAvsnitt[avsnittFørIndeks],
        ...eksisterendeAvsnitt.slice(avsnittEtterIndeks),
    ];
};

export const flyttAvsnittNedover = (
    avsnittId: string,
    eksisterendeAvsnitt: AvsnittMedId[]
): AvsnittMedId[] => {
    const avsnittSomSkalFlyttesIndeks = eksisterendeAvsnitt.findIndex(
        (avsnitt) => avsnitt.id === avsnittId
    );
    const avsnittEtterIndeks = avsnittSomSkalFlyttesIndeks + 1;

    return [
        ...eksisterendeAvsnitt.slice(0, avsnittSomSkalFlyttesIndeks),
        eksisterendeAvsnitt[avsnittEtterIndeks],
        eksisterendeAvsnitt[avsnittSomSkalFlyttesIndeks],
        ...eksisterendeAvsnitt.slice(avsnittEtterIndeks + 1),
    ];
};
