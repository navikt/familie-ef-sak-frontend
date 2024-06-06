import {
    BrevmenyBlokk,
    BrevmenyGruppe,
    BrevStruktur,
    Delmal,
    DelmalGruppe,
    DokumentNavn,
    erDelmalGruppe,
    erFritekstblokk,
    FlettefeltMedVerdi,
    ValgtFelt,
} from './BrevTyper';
import { Dispatch, SetStateAction } from 'react';
import { DelmalStore, FlettefeltStore, ValgfeltStore } from '../../../App/hooks/useVerdierForBrev';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { IBeløpsperiode, IBeregningsperiodeBarnetilsyn } from '../../../App/typer/vedtak';
import { delmalTilUtregningstabellOS } from './UtregningstabellOvergangsstønad';
import { delmalTilUtregningstabellBT } from './UtregningstabellBarnetilsyn';

export const finnFlettefeltNavnOgBeskrivelseFraRef = (
    dokument: BrevStruktur,
    ref: string
): { flettefeltNavn: string; flettefeltBeskrivelse?: string } => {
    const flettefeltFraRef = dokument?.flettefelter?.flettefeltReferanse?.find(
        (felt) => felt._id === ref
    );

    if (!flettefeltFraRef) return { flettefeltNavn: '' };

    return {
        flettefeltNavn: flettefeltFraRef.feltVisningsnavn
            ? flettefeltFraRef.feltVisningsnavn
            : flettefeltFraRef.felt,
        flettefeltBeskrivelse: flettefeltFraRef.beskrivelse,
    };
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

export const grupperBrevmenyBlokker = (blokker: BrevmenyBlokk[]): BrevmenyGruppe[] => {
    return blokker.reduce((acc: BrevmenyGruppe[], blokk) => {
        if (erFritekstblokk(blokk)) {
            return [...acc, { type: 'fritekstområde', fritekstområde: blokk }];
        }

        const delmalgruppe = acc.findIndex(
            (område) =>
                område.type === 'DelmalGruppe' &&
                område.gruppeVisningsnavn === blokk.innhold.gruppeVisningsnavn
        );

        if (delmalgruppe < 0) {
            acc.push({
                type: 'DelmalGruppe',
                gruppeVisningsnavn: blokk.innhold.gruppeVisningsnavn,
                delmaler: [blokk.innhold],
            });
        } else {
            const gruppe = acc[delmalgruppe];
            if (erDelmalGruppe(gruppe)) {
                gruppe.delmaler.push(blokk.innhold);
            }
        }

        return acc;
    }, []);
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
    flettefeltStore: FlettefeltStore
): FlettefeltMedVerdi[] =>
    brevStruktur.flettefelter.flettefeltReferanse.map((flettefeltReferanse) => ({
        _ref: flettefeltReferanse._id,
        verdi:
            flettefeltStore[flettefeltReferanse.felt] ||
            hentVerdiFraMellomlagerEllerNull(flettefeltFraMellomlager, flettefeltReferanse._id),
        automatiskUtfylt: !!flettefeltStore[flettefeltReferanse.felt],
    }));

export const initValgteFelt = (
    valgteFeltFraMellomlager: ValgtFelt | undefined,
    brevStruktur: BrevStruktur,
    valgfeltStore: ValgfeltStore
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

export const erAutomatiskFeltSomSkalSkjules = (
    delmalStore: { delmal: string; skjulIBrevmeny: boolean }[],
    delmal: Delmal
): boolean => {
    const automatiskFeltSomSkalSkjules = delmalStore.find(
        (mal) => mal.delmal === delmal.delmalApiNavn
    )?.skjulIBrevmeny;
    return automatiskFeltSomSkalSkjules || false;
};

export const skalSkjuleAlleDelmaler = (gruppe: DelmalGruppe, delmalStore: DelmalStore): boolean =>
    gruppe.delmaler.every((delmal) => erAutomatiskFeltSomSkalSkjules(delmalStore, delmal));

export function visBrevmal(
    mal: DokumentNavn,
    stønadstype: Stønadstype | undefined,
    frittstående: boolean | undefined
): boolean {
    if (frittstående) {
        return mal.frittstaendeBrev
            ? mal.frittstaendeBrev.valgtSomFrittstaendeBrev === true
            : false;
    }
    if (mal.overgangsstonad == null && mal.barnetilsyn == null && mal.skolepenger == null) {
        return true; // bakoverkompatibilitet ( valg er kanskje ikke utført på eksisterende maler, vises intil videre)
    }

    switch (stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
            return !!mal.overgangsstonad;
        case Stønadstype.BARNETILSYN:
            return !!mal.barnetilsyn;
        case Stønadstype.SKOLEPENGER:
            return !!mal.skolepenger;
        case undefined:
            return true;
    }
}

export const utledHtmlFelterPåStønadstype = (
    stønadstype: Stønadstype,
    beløpsperioder: Ressurs<IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[] | undefined>
) => {
    if (beløpsperioder.status === RessursStatus.SUKSESS) {
        switch (stønadstype) {
            case Stønadstype.OVERGANGSSTØNAD:
                return delmalTilUtregningstabellOS(beløpsperioder.data as IBeløpsperiode[]);
            case Stønadstype.BARNETILSYN:
                return delmalTilUtregningstabellBT(
                    beløpsperioder.data as IBeregningsperiodeBarnetilsyn[]
                );
            case Stønadstype.SKOLEPENGER:
                return null;
        }
    } else {
        return null;
    }
};

export const finnDokumenttittelForBrevmal = (
    brevmaler: Ressurs<DokumentNavn[]>,
    valgtBrevmal: string | undefined
) =>
    brevmaler.status === RessursStatus.SUKSESS &&
    brevmaler.data.find((mal) => mal.apiNavn == valgtBrevmal)?.frittstaendeBrev
        ?.tittelDokumentoversikt;
