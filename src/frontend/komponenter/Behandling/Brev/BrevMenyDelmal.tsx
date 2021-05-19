import { BrevStruktur, Delmal, FlettefeltMedVerdi, Flettefeltreferanse, ValgtFelt } from './Brev';
import React, { Dispatch, SetStateAction } from 'react';
import { ValgfeltSelect } from './ValgfeltSelect';
import { Flettefelt } from './Flettefelt';

interface Props {
    delmal: Delmal;
    dokument: BrevStruktur;
    valgteFelt: ValgtFelt;
    settValgteFelt: Dispatch<SetStateAction<ValgtFelt>>;
    settFlettefelter: Dispatch<SetStateAction<FlettefeltMedVerdi[]>>;
    flettefelter: FlettefeltMedVerdi[];
}
export const BrevMenyDelmal: React.FC<Props> = ({
    delmal,
    dokument,
    valgteFelt,
    settValgteFelt,
    settFlettefelter,
    flettefelter,
}) => {
    const { delmalValgfelt, delmalFlettefelter } = delmal;

    const handleFlettefeltInput = (verdi: string, flettefelt: Flettefeltreferanse) => {
        settFlettefelter((prevState) =>
            prevState.map((felt) => (felt._ref === flettefelt._ref ? { ...felt, verdi } : felt))
        );
    };

    return (
        <>
            {delmalValgfelt.map((valgFelt, index) => (
                <ValgfeltSelect
                    valgFelt={valgFelt}
                    dokument={dokument}
                    valgteFelt={valgteFelt}
                    settValgteFelt={settValgteFelt}
                    flettefelter={flettefelter}
                    settFlettefelter={settFlettefelter}
                    handleFlettefeltInput={handleFlettefeltInput}
                    delmal={delmal}
                    key={`${valgteFelt.valgFeltKategori}${index}`}
                />
            ))}

            {delmalFlettefelter.flatMap((f) =>
                f.flettefelt.map((flettefelt) => (
                    <Flettefelt
                        flettefelt={flettefelt}
                        dokument={dokument}
                        flettefelter={flettefelter}
                        handleFlettefeltInput={handleFlettefeltInput}
                        key={flettefelt._ref}
                    />
                ))
            )}
        </>
    );
};
