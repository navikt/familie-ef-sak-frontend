import { useEffect, useState } from 'react';
import { formaterIsoDato } from '../utils/formatter';
import { Ressurs, RessursStatus } from '../typer/ressurs';
import { IBeløpsperiode, IBeregningsperiodeBarnetilsyn } from '../typer/vedtak';

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
export type DelmalStore = string[];

export type ValgfeltStore = {
    [valgfelt: string]: string;
};

export const useVerdierForBrev = (
    beløpsperioder: Ressurs<IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[] | undefined>
): {
    flettefeltStore: FlettefeltStore;
    valgfeltStore: ValgfeltStore;
    delmalStore: DelmalStore;
} => {
    const [flettefeltStore, settFlettefeltStore] = useState<FlettefeltStore>({});
    const [valgfeltStore, settValgfeltStore] = useState<ValgfeltStore>({});
    const [delmalStore, settDelmalStore] = useState<DelmalStore>([]);

    useEffect(() => {
        if (
            beløpsperioder.status === RessursStatus.SUKSESS &&
            beløpsperioder.data &&
            beløpsperioder.data.length > 0
        ) {
            const perioder = beløpsperioder.data;
            const tilDato = formaterIsoDato(perioder[perioder.length - 1].periode.tildato);
            const fraDato = formaterIsoDato(perioder[0].periode.fradato);

            if (erOvergangstønad(perioder)) {
                settValgfeltStore((prevState) => ({
                    ...prevState,
                    [EBehandlingValgfelt.avslutningHjemmel]: harSamordningsfradrag(perioder)
                        ? EValg.hjemlerMedSamordning
                        : EValg.hjemlerUtenSamordning,
                }));

                settDelmalStore((prevState) => [...prevState, EDelmaler.avslutningHjemler]);
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
        (beløpsperiode) => beløpsperiode.beregningsgrunnlag.samordningsfradrag
    );
};

const erOvergangstønad = (
    beløpsperioder: IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[]
): beløpsperioder is IBeløpsperiode[] => {
    return beløpsperioder.some(
        (beløpsperiode) => (beløpsperiode as IBeløpsperiode).beløpFørSamordning !== undefined
    );
};
