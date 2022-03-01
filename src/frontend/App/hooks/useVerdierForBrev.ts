import { useEffect, useState } from 'react';
import { TilkjentYtelse } from '../typer/tilkjentytelse';
import { formaterIsoDato } from '../utils/formatter';
import { Ressurs, RessursStatus } from '../typer/ressurs';

enum EBehandlingFlettefelt {
    fomdatoInnvilgelseForstegangsbehandling = 'fomdatoInnvilgelseForstegangsbehandling',
    tomdatoInnvilgelseForstegangsbehandling = 'tomdatoInnvilgelseForstegangsbehandling',
}

export const useVerdierForBrev = (
    tilkjentYtelse: Ressurs<TilkjentYtelse | undefined>
): { flettefeltStore: { [navn: string]: string } } => {
    const [flettefeltStore, settFlettefeltStore] = useState<{ [navn: string]: string }>({});

    useEffect(() => {
        if (
            tilkjentYtelse.status === RessursStatus.SUKSESS &&
            tilkjentYtelse.data &&
            tilkjentYtelse.data.andeler.length > 0
        ) {
            const { andeler } = tilkjentYtelse.data;
            settFlettefeltStore((prevState) => ({
                ...prevState,
                [EBehandlingFlettefelt.tomdatoInnvilgelseForstegangsbehandling]: formaterIsoDato(
                    andeler[andeler.length - 1].stønadTil
                ),
                [EBehandlingFlettefelt.fomdatoInnvilgelseForstegangsbehandling]: formaterIsoDato(
                    andeler[0].stønadFra
                ),
            }));
        }
    }, [tilkjentYtelse]);

    return { flettefeltStore };
};
