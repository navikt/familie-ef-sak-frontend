import { Select } from 'nav-frontend-skjema';
import {
    BrevStruktur,
    Delmal,
    FlettefeltMedVerdi,
    Flettefeltreferanse,
    ValgFelt,
    Valgmulighet,
    ValgtFelt,
} from './Brev';
import React, { Dispatch, SetStateAction } from 'react';
import { Flettefelt } from './Flettefelt';

interface Props {
    valgFelt: ValgFelt;
    dokument: BrevStruktur;
    valgteFelt: ValgtFelt;
    settValgteFelt: Dispatch<SetStateAction<ValgtFelt>>;
    settFlettefelter: Dispatch<SetStateAction<FlettefeltMedVerdi[]>>;
    flettefelter: FlettefeltMedVerdi[];
    handleFlettefeltInput: (verdi: string, flettefelt: Flettefeltreferanse) => void;
    delmal: Delmal;
}

export const ValgfeltSelect: React.FC<Props> = ({
    valgFelt,
    valgteFelt,
    settValgteFelt,
    flettefelter,
    handleFlettefeltInput,
    dokument,
    delmal,
}) => {
    const doSettValgteFelt = (
        valgFeltApiNavn: string,
        valgmulighetNavn: string,
        delmal: Delmal
    ) => {
        if (!valgmulighetNavn) {
            const nyState = { ...valgteFelt };
            delete nyState[valgFeltApiNavn];
            settValgteFelt(nyState);
            return;
        }
        const valgmulighet = delmal.delmalValgfelt
            .find((valgFelt) => valgFelt.valgFeltApiNavn === valgFeltApiNavn)!
            .valgMuligheter.find((valgmulighet) => valgmulighet.valgmulighet === valgmulighetNavn)!;

        settValgteFelt((prevState) => {
            return {
                ...prevState,
                [valgFeltApiNavn]: valgmulighet,
            };
        });
    };

    return (
        <>
            <Select
                label={valgFelt.valgfeltVisningsnavn}
                onChange={(e) => doSettValgteFelt(valgFelt.valgFeltApiNavn, e.target.value, delmal)}
            >
                <option value="">Velg land</option>
                {valgFelt.valgMuligheter.map((valMulighet: Valgmulighet) => (
                    <option value={valMulighet.valgmulighet} key={valMulighet.valgmulighet}>
                        {valMulighet.visningsnavnValgmulighet}
                    </option>
                ))}
            </Select>
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
                                key={flettefelt._ref}
                            />
                        ))
                    )
                )}
        </>
    );
};
