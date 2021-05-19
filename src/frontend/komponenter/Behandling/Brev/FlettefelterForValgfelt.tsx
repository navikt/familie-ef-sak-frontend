import React from 'react';
import { BrevStruktur, FlettefeltMedVerdi, Flettefeltreferanse, ValgFelt, ValgtFelt } from './Brev';
import { Flettefelt } from './Flettefelt';

interface Props {
    valgFelt: ValgFelt;
    dokument: BrevStruktur;
    valgteFelt: ValgtFelt;
    flettefelter: FlettefeltMedVerdi[];
    handleFlettefeltInput: (verdi: string, flettefelt: Flettefeltreferanse) => void;
}

export const FlettefelterForValgfelt: React.FC<Props> = ({
    valgteFelt,
    valgFelt,
    dokument,
    handleFlettefeltInput,
    flettefelter,
}) => {
    return (
        <>
            {Object.entries(valgteFelt)
                .filter(([valgNavn]) => valgNavn === valgFelt.valgFeltApiNavn)
                .map(([_, valg]) =>
                    valg.flettefelter.map((felter) =>
                        felter.flettefelt.map((flettefelt) => (
                            <Flettefelt
                                flettefelt={flettefelt}
                                dokument={dokument}
                                flettefelter={flettefelter}
                                handleFlettefeltInput={handleFlettefeltInput}
                            />
                        ))
                    )
                )}
        </>
    );
};
