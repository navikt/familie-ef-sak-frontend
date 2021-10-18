import { useEffect, useState } from 'react';
import { TilkjentYtelse } from '../typer/tilkjentytelse';
import { formaterIsoDato } from '../utils/formatter';
import { Ressurs, RessursStatus } from '../typer/ressurs';

enum EBehandlingFlettefelt {
    fomdatoInnvilgelse = 'fomdatoInnvilgelse',
    tomdatoInnvilgelse = 'tomdatoInnvilgelse',
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
                [EBehandlingFlettefelt.tomdatoInnvilgelse]: formaterIsoDato(
                    andeler[andeler.length - 1].stønadTil
                ),
                [EBehandlingFlettefelt.fomdatoInnvilgelse]: formaterIsoDato(andeler[0].stønadFra),
            }));
        }
    }, [tilkjentYtelse]);

    return { flettefeltStore };
};
