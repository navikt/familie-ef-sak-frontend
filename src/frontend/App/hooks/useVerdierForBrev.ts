import { useEffect, useState } from 'react';
import { formaterIsoDato, formaterTallMedTusenSkille } from '../utils/formatter';
import { IBeløpsperiode, IBeregningsperiodeBarnetilsyn, IVedtak } from '../typer/vedtak';
import { Behandling } from '../typer/fagsak';
import { useInntektsendringAvslagFlettefelt } from './useInntektsendringAvslagFlettefelt';
import { Ressurs, RessursStatus } from '../typer/ressurs';
import { useHentNyesteGrunnbeløpOgAntallGrunnbeløpsperioderTilbakeITid } from './felles/useHentGrunnbeløpsperioder';

export enum EBehandlingFlettefelt {
    fomdatoInnvilgelseForstegangsbehandling = 'fomdatoInnvilgelseForstegangsbehandling',
    tomdatoInnvilgelseForstegangsbehandling = 'tomdatoInnvilgelseForstegangsbehandling',
    fomdatoInnvilgelse = 'fomdatoInnvilgelse',
    tomdatoInnvilgelse = 'tomdatoInnvilgelse',
    fomdatoInnvilgelseBarnetilsyn = 'fomdatoInnvilgelseBarnetilsyn',
    tomdatoInnvilgelseBarnetilsyn = 'tomdatoInnvilgelseBarnetilsyn',
    seksGangerGrunnbelop = 'seksGangerGrunnbelop',
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

export type Brevverdier = {
    flettefeltStore: FlettefeltStore;
    valgfeltStore: ValgfeltStore;
    delmalStore: DelmalStore;
};

export const lagTomBrevverdier = (): Brevverdier => ({
    flettefeltStore: {},
    valgfeltStore: {},
    delmalStore: [],
});

export const useVerdierForBrev = (
    beløpsperioder: Ressurs<IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[] | undefined>,
    behandling: Behandling,
    vedtak: Ressurs<IVedtak | undefined>
): Brevverdier => {
    const [flettefeltStore, settFlettefeltStore] = useState<FlettefeltStore>({});
    const [valgfeltStore, settValgfeltStore] = useState<ValgfeltStore>({});
    const [delmalStore, settDelmalStore] = useState<DelmalStore>([]);
    const { grunnbeløpsperioder, hentGrunnbeløpsperioderCallback } =
        useHentNyesteGrunnbeløpOgAntallGrunnbeløpsperioderTilbakeITid(1);

    const leggTilNyeFlettefelt = (nyeFlettefelt: FlettefeltStore) => {
        settFlettefeltStore((prevState) => ({
            ...prevState,
            ...nyeFlettefelt,
        }));
    };

    const { settFlettefeltForAvslagMindreInntektsøkning } = useInntektsendringAvslagFlettefelt(
        behandling.forrigeBehandlingId,
        leggTilNyeFlettefelt,
        vedtak
    );

    useEffect(() => {
        hentGrunnbeløpsperioderCallback();
    }, [hentGrunnbeløpsperioderCallback]);

    const seksGangerGrunnbeløpTall = grunnbeløpsperioder[0]?.seksGangerGrunnbeløp;

    useEffect(() => {
        if (
            beløpsperioder &&
            beløpsperioder.status === RessursStatus.SUKSESS &&
            beløpsperioder.data &&
            beløpsperioder.data.length > 0
        ) {
            const tilDato = formaterIsoDato(
                beløpsperioder.data[beløpsperioder.data.length - 1].periode.tildato
            );
            const fraDato = formaterIsoDato(beløpsperioder.data[0].periode.fradato);
            const seksGangerGrunnbeløp = seksGangerGrunnbeløpTall?.toLocaleString('nb-NO');

            if (innholderBeløpsperioderForOvergangsstønad(beløpsperioder.data)) {
                const inntektsgrunnlag =
                    beløpsperioder.data[beløpsperioder.data.length - 1].beregningsgrunnlag.inntekt;

                const tiProsentØkning = beregnTiProsentØkningIMånedsinntekt(inntektsgrunnlag);
                const tiProsentReduksjon = beregnTiProsentReduksjonIMånedsinntekt(inntektsgrunnlag);

                leggTilNyeFlettefelt({
                    [EBehandlingFlettefelt.belopInntektPlussTiProsentv2]: tiProsentØkning,
                    [EBehandlingFlettefelt.belopInntektMinusTiProsentv2]: tiProsentReduksjon,
                });

                settValgfeltStore((prevState) => ({
                    ...prevState,
                    [EBehandlingValgfelt.avslutningHjemmel]: harSamordningsfradrag(
                        beløpsperioder.data as IBeløpsperiode[]
                    )
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
                [EBehandlingFlettefelt.seksGangerGrunnbelop]: seksGangerGrunnbeløp,
                [EBehandlingFlettefelt.fomdatoRevurderingBT]: fraDato,
                [EBehandlingFlettefelt.tomdatoRevurderingBT]: tilDato,
            });
        }
    }, [beløpsperioder, seksGangerGrunnbeløpTall]);

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

export const genererBeregnetInntektsTekst = (årsinntekt: number): string => {
    const minusTi = beregnTiProsentReduksjonIMånedsinntekt(årsinntekt);
    const plusTi = beregnTiProsentØkningIMånedsinntekt(årsinntekt);

    return `Forventet årsinntekt fra [DATO]: ${formaterTallMedTusenSkille(årsinntekt)} kroner.
    - 10 % ned: ${minusTi} kroner per måned.
    - 10 % opp: ${plusTi} kroner per måned.`;
};
