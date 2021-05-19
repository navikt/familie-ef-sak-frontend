import { finnFlettefeltNavnFraRef } from './BrevUtils';
import { Input } from 'nav-frontend-skjema';
import React from 'react';
import { BrevStruktur, FlettefeltMedVerdi, Flettefeltreferanse, ValgFelt, ValgtFelt } from './Brev';

interface Props {
    flettefelt: Flettefeltreferanse;
    dokument: BrevStruktur;
    flettefelter: FlettefeltMedVerdi[];
    handleFlettefeltInput: (verdi: string, flettefelt: Flettefeltreferanse) => void;
}

export const Flettefelt: React.FC<Props> = ({
    flettefelt,
    dokument,
    flettefelter,
    handleFlettefeltInput,
}) => {
    return (
        <Input
            label={finnFlettefeltNavnFraRef(dokument, flettefelt._ref)}
            onChange={(e) => {
                handleFlettefeltInput(e.target.value, flettefelt);
            }}
            value={flettefelter.find((felt) => felt._ref === flettefelt._ref)!.verdi || ''}
        />
    );
};
