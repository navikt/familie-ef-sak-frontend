import { Select } from 'nav-frontend-skjema';
import {
    BrevStruktur,
    Delmal,
    FlettefeltMedVerdi,
    Flettefeltreferanse,
    ValgFelt,
    Valgmulighet,
    ValgtFelt,
} from './BrevTyper';
import React, { Dispatch, SetStateAction } from 'react';
import { Flettefelt } from './Flettefelt';
import styled from 'styled-components';

const StyledValgfeltSelect = styled.div`
    padding-bottom: 2.5rem;
`;

interface Props {
    valgFelt: ValgFelt;
    dokument: BrevStruktur;
    valgteFelt: ValgtFelt;
    settValgteFelt: Dispatch<SetStateAction<ValgtFelt>>;
    settFlettefelter: Dispatch<SetStateAction<FlettefeltMedVerdi[]>>;
    flettefelter: FlettefeltMedVerdi[];
    handleFlettefeltInput: (verdi: string, flettefelt: Flettefeltreferanse) => void;
    delmal: Delmal;
    settKanSendeTilBeslutter: (kanSendeTilBeslutter: boolean) => void;
}

export const ValgfeltSelect: React.FC<Props> = ({
    valgFelt,
    valgteFelt,
    settValgteFelt,
    flettefelter,
    handleFlettefeltInput,
    dokument,
    delmal,
    settKanSendeTilBeslutter,
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

        const valgmulighet = delmal?.delmalValgfelt
            .find((valgFelt) => valgFelt.valgFeltApiNavn === valgFeltApiNavn)
            ?.valgMuligheter.find((valgmulighet) => valgmulighet.valgmulighet === valgmulighetNavn);

        valgmulighet &&
            settValgteFelt((prevState) => {
                return {
                    ...prevState,
                    [valgFeltApiNavn]: valgmulighet,
                };
            });
        settKanSendeTilBeslutter(false);
    };

    return (
        <StyledValgfeltSelect>
            <Select
                label={valgFelt.valgfeltVisningsnavn}
                onChange={(e) => doSettValgteFelt(valgFelt.valgFeltApiNavn, e.target.value, delmal)}
            >
                <option value="">Ikke valgt</option>
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
                                fetLabel={false}
                                flettefelt={flettefelt}
                                dokument={dokument}
                                flettefelter={flettefelter}
                                handleFlettefeltInput={handleFlettefeltInput}
                                key={flettefelt._ref}
                            />
                        ))
                    )
                )}
        </StyledValgfeltSelect>
    );
};
