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

export const useVerdierForBrev = (
    beløpsperioder: Ressurs<IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[] | undefined>
): { flettefeltStore: { [navn: string]: string } } => {
    const [flettefeltStore, settFlettefeltStore] = useState<{ [navn: string]: string }>({});
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
    }, [beløpsperioder, toggles]);

    return { flettefeltStore };
};
