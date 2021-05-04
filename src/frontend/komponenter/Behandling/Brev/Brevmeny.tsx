import React, { Dispatch, SetStateAction } from 'react';
import { DokumentFelt, Valgmulighet } from './Brev';
import { Input, Select } from 'nav-frontend-skjema';

type ValgtFelt = { [valgFeltKategori: string]: Valgmulighet };

interface Props {
    dokument: DokumentFelt[];
    valgteFelt: ValgtFelt;
    settValgteFelt: Dispatch<SetStateAction<ValgtFelt>>;
}
const Brevmeny: React.FC<Props> = ({ dokument, settValgteFelt, valgteFelt }) => {
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

    return (
        <>
            {dokument.map((dok) => {
                return (
                    <div style={{ backgroundColor: 'lightblue', margin: '2rem 0' }}>
                        <Select
                            label={dok.visningsnavn}
                            onChange={(e) => doSettValgteFelt(dok.valgFeltKategori, e.target.value)}
                        >
                            {dok.valgMuligheter.map((valMulighet: Valgmulighet) => (
                                <option value={valMulighet.valgmulighet}>
                                    {valMulighet.visningsnavnValgmulighet}
                                </option>
                            ))}
                        </Select>
                        {valgteFelt[dok.valgFeltKategori] != null &&
                            valgteFelt[dok.valgFeltKategori].flettefelt.map((flett) => (
                                <Input label={flett.felt} />
                            ))}
                    </div>
                );
            })}
        </>
    );
};

export default Brevmeny;
