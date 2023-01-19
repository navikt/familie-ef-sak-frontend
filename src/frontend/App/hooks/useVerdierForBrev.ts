import { useEffect, useState } from 'react';
import { formaterIsoDato } from '../utils/formatter';
import { Ressurs, RessursStatus } from '../typer/ressurs';
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

enum EBehandlingValgmulighet {
    vedtakInneholderSamordning = 'hjemmelM1513',
    vedtakInneholderIkkeSamordning = 'hjemmelInnvilgetTilbakeITidM1513',
}

type Valgmulighet = {
    valgmulighet: string;
};

type IFlettefeltStore = { [navn: string]: string };

export type IValgfeltStore = {
    [valgfeltKategori: string]: Valgmulighet;
};

export const useVerdierForBrev = (
    beløpsperioder: Ressurs<IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[] | undefined>
): {
    flettefeltStore: IFlettefeltStore;
    valgfeltStore: IValgfeltStore;
} => {
    const [flettefeltStore, settFlettefeltStore] = useState<IFlettefeltStore>({});
    const [valgfeltStore, settValgfeltStore] = useState<IValgfeltStore>({});
    const { toggles } = useToggles();

    useEffect(() => {
        if (
            beløpsperioder.status === RessursStatus.SUKSESS &&
            beløpsperioder.data &&
            beløpsperioder.data.length > 0
        ) {
            const perioder = beløpsperioder.data;
            const tilDato = formaterIsoDato(perioder[perioder.length - 1].periode.tildato);
            const fraDato = formaterIsoDato(perioder[0].periode.fradato);

            erOvergangstønad(perioder) &&
                settValgfeltStore({
                    ...valgfeltStore,
                    [EBehandlingValgfelt.avslutningHjemmel]: harSamordningsfradrag(perioder)
                        ? { valgmulighet: EBehandlingValgmulighet.vedtakInneholderSamordning }
                        : { valgmulighet: EBehandlingValgmulighet.vedtakInneholderIkkeSamordning },
                });

            const toggledeVedtaksdatoFlettefelter: { [flettefeltNavn: string]: string } = toggles[
                ToggleName.automatiskeVedtaksdatoerBrev
            ]
                ? {
                      [EBehandlingFlettefelt.tomdatoInnvilgelse]: tilDato,
                      [EBehandlingFlettefelt.fomdatoInnvilgelse]: fraDato,
                      [EBehandlingFlettefelt.fomdatoInnvilgelseBarnetilsyn]: fraDato,
                      [EBehandlingFlettefelt.tomdatoInnvilgelseBarnetilsyn]: tilDato,
                      [EBehandlingFlettefelt.fomdatoRevurderingBT]: fraDato,
                      [EBehandlingFlettefelt.tomdatoRevurderingBT]: tilDato,
                  }
                : {};

            settFlettefeltStore((prevState) => ({
                ...prevState,
                [EBehandlingFlettefelt.tomdatoInnvilgelseForstegangsbehandling]: tilDato,
                [EBehandlingFlettefelt.fomdatoInnvilgelseForstegangsbehandling]: fraDato,
                ...toggledeVedtaksdatoFlettefelter,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [beløpsperioder, toggles]);

    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log('valgfeltstore: ', valgfeltStore);
    }, [valgfeltStore]);

    return { flettefeltStore, valgfeltStore };
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
