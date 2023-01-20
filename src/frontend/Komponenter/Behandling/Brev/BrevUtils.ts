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
import { Dispatch, SetStateAction } from 'react';
import { IValgfeltStore } from '../../../App/hooks/useVerdierForBrev';

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

export const initValgteFelt = (
    valgteFeltFraMellomlager: ValgtFelt | undefined,
    brevStruktur: BrevStruktur,
    valgfeltStore: IValgfeltStore
): ValgtFelt => {
    const valgfeltMellomlager = Object.entries(valgteFeltFraMellomlager || {}).reduce(
        (acc, [valgfeltApiNavn, mulighet]) => {
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
        },
        {}
    );

    const automatiskeValgfelt = Object.entries(valgfeltStore).reduce((acc, [valgfelt, valg]) => {
        const delmal = brevStruktur.dokument.delmalerSortert.find((delmal) =>
            delmal.delmalValgfelt.some((v) => v.valgFeltApiNavn === valgfelt)
        );

        const valgmulighet = delmal?.delmalValgfelt
            .find((v) => v.valgFeltApiNavn === valgfelt)
            ?.valgMuligheter.find((valgmulighet) => valgmulighet.valgmulighet === valg);
        return { ...acc, [valgfelt]: valgmulighet };
    }, {});

    return { ...valgfeltMellomlager, ...automatiskeValgfelt };
};

export const harValgfeltFeil = (
    valgteFelt: ValgtFelt,
    brevStruktur: BrevStruktur,
    settFeil: Dispatch<SetStateAction<string>>
): boolean => {
    const harFeil = Object.entries(valgteFelt).some(([valgfeltApiNavn, valgtMulighet]) =>
        brevStruktur.dokument.delmalerSortert.some((delmal) => {
            const valgfeltFraMal = delmal.delmalValgfelt.find(
                (valgFelt) => valgFelt.valgFeltApiNavn === valgfeltApiNavn
            );

            if (valgfeltFraMal) {
                const mellomlagerHarGyldigValg = valgfeltFraMal.valgMuligheter.some(
                    (mulighetFraMal) => mulighetFraMal.valgmulighet === valgtMulighet.valgmulighet
                );

                if (!mellomlagerHarGyldigValg) {
                    settFeil(
                        `En endring har skjedd i brevmalen siden forrige mellomlagring. Valget ${valgtMulighet.visningsnavnValgmulighet} under ${valgfeltFraMal.valgfeltVisningsnavn} er ikke lengre et gyldig valg. Vennligst ta stilling til det på nytt`
                    );
                    return true;
                }
            }
            return false;
        })
    );

    if (!harFeil) {
        settFeil('');
    }
    return harFeil;
};

export const initielleAvsnittMellomlager = (
    mellomlagretFritekstbrev: IFritekstBrev | IFrittståendeBrev | undefined
): AvsnittMedId[] =>
    mellomlagretFritekstbrev
        ? mellomlagretFritekstbrev.avsnitt.map((avsnitt) => ({ ...avsnitt, id: uuidv4() }))
        : [];

export const skjulAvsnittUtenVerdi = (avsnitt: AvsnittMedId[]): AvsnittMedId[] =>
    avsnitt.map((avsnitt) => {
        if (avsnitt.skalSkjulesIBrevbygger === undefined) {
            return { ...avsnitt, skalSkjulesIBrevbygger: true };
        } else {
            return avsnitt;
        }
    });

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
