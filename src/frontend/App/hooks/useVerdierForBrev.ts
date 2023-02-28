import { useEffect, useState } from 'react';
import { formaterIsoDato, formaterTallMedTusenSkille } from '../utils/formatter';
import { IBeløpsperiode, IBeregningsperiodeBarnetilsyn } from '../typer/vedtak';
import { Behandling } from '../typer/fagsak';
import { useInntektsendringAvslagFlettefelt } from './useInntektsendringAvslagFlettefelt';

export enum EBehandlingFlettefelt {
    fomdatoInnvilgelseForstegangsbehandling = 'fomdatoInnvilgelseForstegangsbehandling',
    tomdatoInnvilgelseForstegangsbehandling = 'tomdatoInnvilgelseForstegangsbehandling',
    fomdatoInnvilgelse = 'fomdatoInnvilgelse',
    tomdatoInnvilgelse = 'tomdatoInnvilgelse',
    fomdatoInnvilgelseBarnetilsyn = 'fomdatoInnvilgelseBarnetilsyn',
    tomdatoInnvilgelseBarnetilsyn = 'tomdatoInnvilgelseBarnetilsyn',
    fomdatoRevurderingBT = 'fomdatoRevurderingBT',
    tomdatoRevurderingBT = 'tomdatoRevurderingBT',
    belopInntektPlussTiProsentv2 = 'belopInntektPlussTiProsentv2', // Innvilgelse 10% økning
    belopInntektMinusTiProsentv2 = 'belopInntektMinusTiProsentv2', // Innvilgelse 10% reduksjon
    navarendeArsinntekt = 'navarendeArsinntekt', // Avslag nåværende inntekt
    manedsinntektTiProsentOkning = 'manedsinntektTiProsentOkning', // Avslag 10% økning
    manedsinntektTiProsentReduksjon = 'manedsinntektTiProsentReduksjon', // Avslag 10% reduksjon
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
    beløpsperioder: IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[] | undefined,
    behandling: Behandling
): {
    flettefeltStore: FlettefeltStore;
    valgfeltStore: ValgfeltStore;
    delmalStore: DelmalStore;
} => {
    const [flettefeltStore, settFlettefeltStore] = useState<FlettefeltStore>({});
    const [valgfeltStore, settValgfeltStore] = useState<ValgfeltStore>({});
    const [delmalStore, settDelmalStore] = useState<DelmalStore>([]);

    const leggTilNyeFlettefelt = (nyeFlettefelt: FlettefeltStore) => {
        settFlettefeltStore((prevState) => ({
            ...prevState,
            ...nyeFlettefelt,
        }));
    };

    const { settFlettefeltForAvslagMindreInntektsøkning } = useInntektsendringAvslagFlettefelt(
        behandling.id,
        behandling.forrigeBehandlingId,
        leggTilNyeFlettefelt
    );

    useEffect(() => {
        if (beløpsperioder && beløpsperioder.length > 0) {
            const tilDato = formaterIsoDato(
                beløpsperioder[beløpsperioder.length - 1].periode.tildato
            );
            const fraDato = formaterIsoDato(beløpsperioder[0].periode.fradato);

            if (innholderBeløpsperioderForOvergangsstønad(beløpsperioder)) {
                const inntektsgrunnlag =
                    beløpsperioder[beløpsperioder.length - 1].beregningsgrunnlag.inntekt;

                const tiProsentØkning = beregnTiProsentØkningIMånedsinntekt(inntektsgrunnlag);
                const tiProsentReduksjon = beregnTiProsentReduksjonIMånedsinntekt(inntektsgrunnlag);

                leggTilNyeFlettefelt({
                    [EBehandlingFlettefelt.belopInntektPlussTiProsentv2]: tiProsentØkning,
                    [EBehandlingFlettefelt.belopInntektMinusTiProsentv2]: tiProsentReduksjon,
                });

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

            leggTilNyeFlettefelt({
                [EBehandlingFlettefelt.tomdatoInnvilgelseForstegangsbehandling]: tilDato,
                [EBehandlingFlettefelt.fomdatoInnvilgelseForstegangsbehandling]: fraDato,
                [EBehandlingFlettefelt.tomdatoInnvilgelse]: tilDato,
                [EBehandlingFlettefelt.fomdatoInnvilgelse]: fraDato,
                [EBehandlingFlettefelt.fomdatoInnvilgelseBarnetilsyn]: fraDato,
                [EBehandlingFlettefelt.tomdatoInnvilgelseBarnetilsyn]: tilDato,
                [EBehandlingFlettefelt.fomdatoRevurderingBT]: fraDato,
                [EBehandlingFlettefelt.tomdatoRevurderingBT]: tilDato,
            });
        }
    }, [beløpsperioder]);

    useEffect(() => {
        settFlettefeltForAvslagMindreInntektsøkning();
    }, [settFlettefeltForAvslagMindreInntektsøkning]);

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

export const beregnTiProsentØkningIMånedsinntekt = (årsinntekt: number) =>
    formaterTallMedTusenSkille(Math.floor((årsinntekt / 12) * 1.1));

export const beregnTiProsentReduksjonIMånedsinntekt = (årsinntekt: number) =>
    formaterTallMedTusenSkille(Math.floor((årsinntekt / 12) * 0.9));
