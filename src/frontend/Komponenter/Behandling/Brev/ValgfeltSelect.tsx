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
import { Checkbox, Label, Select } from '@navikt/ds-react';

const StyledValgfeltSelect = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
            {valgFelt.valgMuligheter.length > 1 ? (
                <Select
                    label={valgFelt.valgfeltVisningsnavn}
                    defaultValue={valgteFelt[valgFelt.valgFeltApiNavn]?.valgmulighet}
                    onChange={(e) =>
                        doSettValgteFelt(valgFelt.valgFeltApiNavn, e.target.value, delmal)
                    }
                >
                    <option value="">Ikke valgt</option>
                    {valgFelt.valgMuligheter.map((valgMulighet: Valgmulighet) => (
                        <option value={valgMulighet.valgmulighet} key={valgMulighet.valgmulighet}>
                            {valgMulighet.visningsnavnValgmulighet}
                        </option>
                    ))}
                </Select>
            ) : (
                <>
                    <Label size={'small'}>{valgFelt.valgfeltVisningsnavn}</Label>
                    <Checkbox
                        checked={!!valgteFelt[valgFelt.valgFeltApiNavn]}
                        onClick={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                                doSettValgteFelt(
                                    valgFelt.valgFeltApiNavn,
                                    valgFelt.valgMuligheter[0].valgmulighet,
                                    delmal
                                );
                            } else {
                                doSettValgteFelt(valgFelt.valgFeltApiNavn, '', delmal);
                            }
                        }}
                    >
                        {valgFelt.valgMuligheter[0].visningsnavnValgmulighet}
                    </Checkbox>
                </>
            )}
            {Object.entries(valgteFelt)
                .filter(([valgNavn]) => valgNavn === valgFelt.valgFeltApiNavn)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .map(([_, valg]) => {
                    const refs: string[] = [];

                    return valg.flettefelter.map((felter) =>
                        felter.flettefelt.map((flettefelt) => {
                            if (!refs.includes(flettefelt._ref)) {
                                refs.push(flettefelt._ref);

                                return (
                                    <Flettefelt
                                        fetLabel={false}
                                        flettefelt={flettefelt}
                                        dokument={dokument}
                                        flettefelter={flettefelter}
                                        handleFlettefeltInput={handleFlettefeltInput}
                                        key={flettefelt._ref}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })
                    );
                })}
        </StyledValgfeltSelect>
    );
};
