import {
    BrevStruktur,
    Delmal,
    FlettefeltMedVerdi,
    Flettefeltreferanse,
    ValgtFelt,
} from './BrevTyper';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ValgfeltSelect } from './ValgfeltSelect';
import { Flettefelt } from './Flettefelt';
import { Checkbox } from 'nav-frontend-skjema';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';

interface Props {
    delmal: Delmal;
    dokument: BrevStruktur;
    valgteFelt: ValgtFelt;
    settValgteFelt: Dispatch<SetStateAction<ValgtFelt>>;
    settFlettefelter: Dispatch<SetStateAction<FlettefeltMedVerdi[]>>;
    flettefelter: FlettefeltMedVerdi[];
    settValgteDelmaler: Dispatch<SetStateAction<Record<string, boolean>>>;
}
export const BrevMenyDelmal: React.FC<Props> = ({
    delmal,
    dokument,
    valgteFelt,
    settValgteFelt,
    settFlettefelter,
    flettefelter,
    settValgteDelmaler,
}) => {
    const { delmalValgfelt, delmalFlettefelter } = delmal;
    const [åpen, settÅpen] = useState(false);

    const handleFlettefeltInput = (verdi: string, flettefelt: Flettefeltreferanse) => {
        settFlettefelter((prevState) =>
            prevState.map((felt) => (felt._ref === flettefelt._ref ? { ...felt, verdi } : felt))
        );
    };

    const håndterToggleDelmal = (e: React.ChangeEvent<HTMLInputElement>) => {
        settValgteDelmaler((prevState) => ({
            ...prevState,
            [delmal.delmalApiNavn]: e.target.checked,
        }));
        settÅpen(e.target.checked);
    };

    return (
        <>
            <EkspanderbartpanelBase
                tittel={<Checkbox label={delmal.delmalNavn} onChange={håndterToggleDelmal} />}
                apen={åpen}
                onClick={() => {
                    settÅpen(!åpen);
                }}
            >
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
            </EkspanderbartpanelBase>
        </>
    );
};
