import React, { Dispatch, SetStateAction } from 'react';
import { Delmal, FletteMedVerdi, Valgmulighet } from './Brev';
import { Input, Select } from 'nav-frontend-skjema';

type ValgtFelt = { [valgFeltKategori: string]: Valgmulighet };

interface Props {
    dokument: Delmal[];
    valgteFelt: ValgtFelt;
    settValgteFelt: Dispatch<SetStateAction<ValgtFelt>>;
    settFlettefelter: Dispatch<SetStateAction<FletteMedVerdi[]>>;
    fletteFelter: FletteMedVerdi[];
}
const Brevmeny: React.FC<Props> = ({
    dokument,
    settValgteFelt,
    valgteFelt,
    settFlettefelter,
    fletteFelter,
}) => {
    const doSettValgteFelt = (valgFeltKategori: string, valgmulighet: string) => {
        const d = dokument
            .find((v) => v.valgFeltKategori === valgFeltKategori)
            ?.valgMuligheter.find((v) => v.valgmulighet === valgmulighet);
        d &&
            settValgteFelt((prevState: { [valgFeltKategori: string]: Valgmulighet }) => ({
                ...prevState,
                [valgFeltKategori]: d,
            }));
    };

    const håndterFlettefeltInput = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        settFlettefelter((prevState) => {
            return prevState.map((flettefelt) => {
                return flettefelt._id === id
                    ? { ...flettefelt, verdi: event.target.value }
                    : flettefelt;
            });
        });
    };

    return (
        <>
            {dokument.map((dok, index) => {
                return (
                    <div style={{ backgroundColor: 'lightblue', margin: '2rem 0' }} key={index}>
                        <Select
                            label={dok.visningsnavn}
                            onChange={(e) => doSettValgteFelt(dok.valgFeltKategori, e.target.value)}
                        >
                            {dok.valgMuligheter.map((valMulighet: Valgmulighet) => (
                                <option
                                    value={valMulighet.valgmulighet}
                                    key={valMulighet.valgmulighet}
                                >
                                    {valMulighet.visningsnavnValgmulighet}
                                </option>
                            ))}
                        </Select>
                        {valgteFelt[dok.valgFeltKategori] != null &&
                            valgteFelt[dok.valgFeltKategori].flettefelt.map((flett, index) => (
                                <Input
                                    key={`${flett._id}${index}`}
                                    value={
                                        fletteFelter.find((felt) => felt._id === flett._id)
                                            ?.verdi ?? ''
                                    }
                                    label={flett.felt}
                                    onChange={(e) => håndterFlettefeltInput(e, flett._id)}
                                />
                            ))}
                    </div>
                );
            })}
        </>
    );
};

export default Brevmeny;
