import { useEffect, useState } from 'react';
import { formaterIsoDato } from '../utils/formatter';
import { Ressurs, RessursStatus } from '../typer/ressurs';
import { IBeløpsperiode } from '../typer/vedtak';

enum EBehandlingFlettefelt {
    fomdatoInnvilgelseForstegangsbehandling = 'fomdatoInnvilgelseForstegangsbehandling',
    tomdatoInnvilgelseForstegangsbehandling = 'tomdatoInnvilgelseForstegangsbehandling',
}

export const useVerdierForBrev = (
    beløpsperioder: Ressurs<IBeløpsperiode[] | undefined>
): { flettefeltStore: { [navn: string]: string } } => {
    const [flettefeltStore, settFlettefeltStore] = useState<{ [navn: string]: string }>({});

    useEffect(() => {
        if (
            beløpsperioder.status === RessursStatus.SUKSESS &&
            beløpsperioder.data &&
            beløpsperioder.data.length > 0
        ) {
            const perioder = beløpsperioder.data;
            settFlettefeltStore((prevState) => ({
                ...prevState,
                [EBehandlingFlettefelt.tomdatoInnvilgelseForstegangsbehandling]: formaterIsoDato(
                    perioder[perioder.length - 1].periode.tildato
                ),
                [EBehandlingFlettefelt.fomdatoInnvilgelseForstegangsbehandling]: formaterIsoDato(
                    perioder[0].periode.fradato
                ),
            }));
        }
    }, [beløpsperioder]);

    return { flettefeltStore };
};
