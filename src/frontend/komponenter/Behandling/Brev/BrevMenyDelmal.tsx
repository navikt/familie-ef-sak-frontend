import { BrevStruktur, Delmal, FlettefeltMedVerdi, Flettefeltreferanse, ValgtFelt } from './Brev';
import { Input } from 'nav-frontend-skjema';
import React, { Dispatch, SetStateAction } from 'react';
import { ValgfeltSelect } from './ValgfeltSelect';
import { finnFlettefeltNavnFraRef } from './BrevUtils';

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
            {delmalValgfelt.map((valgFelt) => (
                <ValgfeltSelect
                    valgFelt={valgFelt}
                    dokument={dokument}
                    valgteFelt={valgteFelt}
                    settValgteFelt={settValgteFelt}
                    flettefelter={flettefelter}
                    settFlettefelter={settFlettefelter}
                    handleFlettefeltInput={handleFlettefeltInput}
                    delmal={delmal}
                />
            ))}

            {delmalFlettefelter.flatMap((f) =>
                f.flettefelt.map((flettefelt) => (
                    <Input
                        label={finnFlettefeltNavnFraRef(dokument, flettefelt._ref)}
                        onChange={(e) => {
                            handleFlettefeltInput(e.target.value, flettefelt);
                        }}
                        value={
                            (
                                flettefelter.find((felt) => felt._ref === flettefelt._ref) ?? {
                                    verdi: '',
                                }
                            ).verdi || ''
                        }
                    />
                ))
            )}
        </>
    );
};
