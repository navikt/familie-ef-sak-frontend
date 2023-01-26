import { useEffect, useState } from 'react';
import { formaterIsoDato } from '../utils/formatter';
import { IBeløpsperiode, IBeregningsperiodeBarnetilsyn } from '../typer/vedtak';
import { useToggles } from '../context/TogglesContext';
import { ToggleName } from '../context/toggles';

enum EBehandlingFlettefelt {
    fomdatoInnvilgelseForstegangsbehandling = 'fomdatoInnvilgelseForstegangsbehandling',
    tomdatoInnvilgelseForstegangsbehandling = 'tomdatoInnvilgelseForstegangsbehandling',
    fomdatoInnvilgelse = 'fomdatoInnvilgelse',
    tomdatoInnvilgelse = 'tomdatoInnvilgelse',
    fomdatoInnvilgelseBarnetilsyn = 'fomdatoInnvilgelseBarnetilsyn',
    tomdatoInnvilgelseBarnetilsyn = 'tomdatoInnvilgelseBarnetilsyn',
    fomdatoRevurderingBT = 'fomdatoRevurderingBT',
    tomdatoRevurderingBT = 'tomdatoRevurderingBT',
}

enum EBehandlingValgfelt {
    avslutningHjemmel = 'avslutningHjemmel',
}

enum EValg {
    hjemlerMedSamordning = 'hjemmelM1513',
    hjemlerUtenSamordning = 'hjemmelInnvilgetTilbakeITidM1513',
}

enum EDelmaler {
    avslutningHjemler = 'avslutning',
}

export type FlettefeltStore = { [navn: string]: string };
export type DelmalStore = { delmal: string; skjulIBrevmeny: boolean }[];

export type ValgfeltStore = {
    [valgfelt: string]: string;
};

export const useVerdierForBrev = (
    beløpsperioder: IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[] | undefined
): {
    flettefeltStore: FlettefeltStore;
    valgfeltStore: ValgfeltStore;
    delmalStore: DelmalStore;
} => {
    const [flettefeltStore, settFlettefeltStore] = useState<FlettefeltStore>({});
    const [valgfeltStore, settValgfeltStore] = useState<ValgfeltStore>({});
    const [delmalStore, settDelmalStore] = useState<DelmalStore>([]);
    const { toggles } = useToggles();

    useEffect(() => {
        if (beløpsperioder && beløpsperioder.length > 0) {
            const tilDato = formaterIsoDato(
                beløpsperioder[beløpsperioder.length - 1].periode.tildato
            );
            const fraDato = formaterIsoDato(beløpsperioder[0].periode.fradato);

            if (
                innholderBeløpsperioderForOvergangsstønad(beløpsperioder) &&
                toggles[ToggleName.automatiskeHjemlerBrev]
            ) {
                settValgfeltStore((prevState) => ({
                    ...prevState,
                    [EBehandlingValgfelt.avslutningHjemmel]: harSamordningsfradrag(beløpsperioder)
                        ? EValg.hjemlerMedSamordning
                        : EValg.hjemlerUtenSamordning,
                }));

                settDelmalStore((prevState) => [
                    ...prevState,
                    { delmal: EDelmaler.avslutningHjemler, skjulIBrevmeny: true },
                ]);
            }

            settFlettefeltStore((prevState) => ({
                ...prevState,
                [EBehandlingFlettefelt.tomdatoInnvilgelseForstegangsbehandling]: tilDato,
                [EBehandlingFlettefelt.fomdatoInnvilgelseForstegangsbehandling]: fraDato,
                [EBehandlingFlettefelt.tomdatoInnvilgelse]: tilDato,
                [EBehandlingFlettefelt.fomdatoInnvilgelse]: fraDato,
                [EBehandlingFlettefelt.fomdatoInnvilgelseBarnetilsyn]: fraDato,
                [EBehandlingFlettefelt.tomdatoInnvilgelseBarnetilsyn]: tilDato,
                [EBehandlingFlettefelt.fomdatoRevurderingBT]: fraDato,
                [EBehandlingFlettefelt.tomdatoRevurderingBT]: tilDato,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [beløpsperioder]);

    return { flettefeltStore, valgfeltStore, delmalStore };
};

const harSamordningsfradrag = (beløpsperioder: IBeløpsperiode[]): boolean => {
    return beløpsperioder.some(
        (beløpsperiode) =>
            beløpsperiode.beregningsgrunnlag.samordningsfradrag &&
            beløpsperiode.beregningsgrunnlag.samordningsfradrag > 0
    );
};

const innholderBeløpsperioderForOvergangsstønad = (
    beløpsperioder: IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[]
): beløpsperioder is IBeløpsperiode[] => {
    return beløpsperioder.some(
        (beløpsperiode) => (beløpsperiode as IBeløpsperiode).beløpFørSamordning !== undefined
    );
};
