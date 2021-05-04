import React, { Dispatch, SetStateAction } from 'react';
import { DokumentFelt, Valgmulighet } from './Brev';
import { Select } from 'nav-frontend-skjema';

type ValgtFelt = { [valgFeltKategori: string]: Valgmulighet };

interface Props {
    dokument: DokumentFelt[];
    valgteFelt?: ValgtFelt;
    settValgteFelt: Dispatch<SetStateAction<ValgtFelt>>;
}

const Brevmeny: React.FC<Props> = ({ dokument, settValgteFelt }) => {
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
                );
            })}
        </>
    );
};

export default Brevmeny;
