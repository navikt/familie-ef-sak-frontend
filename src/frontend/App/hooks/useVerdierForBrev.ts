import { useEffect, useState } from 'react';
import { formaterIsoDato } from '../utils/formatter';
import {
    EAvslagÅrsak,
    EBehandlingResultat,
    IBeløpsperiode,
    IBeregningsperiodeBarnetilsyn,
} from '../typer/vedtak';
import { useHentVedtak } from './useHentVedtak';
import { RessursStatus } from '../typer/ressurs';
import { useHentForrigeInntektsgrunnlag } from './useHentForrigeInntektsgrunnlag';

enum EBehandlingFlettefelt {
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
    behandlingId: string
): {
    flettefeltStore: FlettefeltStore;
    valgfeltStore: ValgfeltStore;
    delmalStore: DelmalStore;
} => {
    const [flettefeltStore, settFlettefeltStore] = useState<FlettefeltStore>({});
    const [valgfeltStore, settValgfeltStore] = useState<ValgfeltStore>({});
    const [delmalStore, settDelmalStore] = useState<DelmalStore>([]);
    const { hentVedtak, vedtak } = useHentVedtak(behandlingId);
    const { forrigeInntektsgrunnlag, hentForrigeInntektsgrunnlag } =
        useHentForrigeInntektsgrunnlag(behandlingId);

    useEffect(() => {
        if (beløpsperioder && beløpsperioder.length > 0) {
            const tilDato = formaterIsoDato(
                beløpsperioder[beløpsperioder.length - 1].periode.tildato
            );
            const fraDato = formaterIsoDato(beløpsperioder[0].periode.fradato);

            if (innholderBeløpsperioderForOvergangsstønad(beløpsperioder)) {
                const inntektsgrunnlag =
                    beløpsperioder[beløpsperioder.length - 1].beregningsgrunnlag.inntekt;

                const tiProsentØkning = inntektsgrunnlag * 1.1;
                const tiProsentReduksjon = inntektsgrunnlag * 0.9;

                settFlettefeltStore((prevState) => ({
                    ...prevState,
                    [EBehandlingFlettefelt.belopInntektPlussTiProsentv2]:
                        tiProsentØkning.toString(),
                    [EBehandlingFlettefelt.belopInntektMinusTiProsentv2]:
                        tiProsentReduksjon.toString(),
                }));

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

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

    useEffect(() => {
        if (
            vedtak.status === RessursStatus.SUKSESS &&
            vedtak.data?.resultatType === EBehandlingResultat.AVSLÅ &&
            vedtak.data.avslåÅrsak === EAvslagÅrsak.MINDRE_INNTEKTSENDRINGER
        ) {
            hentForrigeInntektsgrunnlag();
        }
    }, [vedtak, hentForrigeInntektsgrunnlag]);

    useEffect(() => {
        if (
            forrigeInntektsgrunnlag.status === RessursStatus.SUKSESS &&
            forrigeInntektsgrunnlag.data
        ) {
            const nåværendeInntekt = forrigeInntektsgrunnlag.data;
            const tiProsentØkning = nåværendeInntekt * 1.1;
            const tiProsentReduksjon = nåværendeInntekt * 0.9;

            settFlettefeltStore((prevState) => ({
                ...prevState,
                [EBehandlingFlettefelt.navarendeArsinntekt]: nåværendeInntekt.toString(),
                [EBehandlingFlettefelt.manedsinntektTiProsentOkning]: tiProsentØkning.toString(),
                [EBehandlingFlettefelt.manedsinntektTiProsentReduksjon]:
                    tiProsentReduksjon.toString(),
            }));
        }
    }, [forrigeInntektsgrunnlag]);

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
