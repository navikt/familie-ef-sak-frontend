import React, { Dispatch, SetStateAction } from 'react';
import { BrevStruktur, FlettefeltMedVerdi, ValgtFelt } from './Brev';
import { BrevMenyDelmal } from './BrevMenyDelmal';

interface Props {
    dokument: BrevStruktur;
    valgteFelt: ValgtFelt;
    settValgteFelt: Dispatch<SetStateAction<ValgtFelt>>;
    settFlettefelter: Dispatch<SetStateAction<FlettefeltMedVerdi[]>>;
    flettefelter: FlettefeltMedVerdi[];
}

const Brevmeny: React.FC<Props> = ({
    dokument,
    settValgteFelt,
    valgteFelt,
    settFlettefelter,
    flettefelter,
}) => {
    return (
        <>
            {dokument.dokument.delmaler.map((delmal) => (
                <BrevMenyDelmal
                    delmal={delmal}
                    dokument={dokument}
                    valgteFelt={valgteFelt}
                    settValgteFelt={settValgteFelt}
                    flettefelter={flettefelter}
                    settFlettefelter={settFlettefelter}
                />
            ))}
        </>
    );
};

export default Brevmeny;
